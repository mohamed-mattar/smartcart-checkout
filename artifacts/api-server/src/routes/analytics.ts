import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { pool } from "@workspace/db";

const router: IRouter = Router();

/**
 * Rate limiter — 60 requests per minute per IP.
 * Prevents abuse of the ingest endpoint without impacting normal usage
 * (a typical session fires < 10 events in total).
 */
const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
});

/**
 * Input schema for POST /api/analytics/event.
 *
 * session_id  — UUID v4 generated client-side and stored in sessionStorage.
 * event_type  — short slug identifying the event (session_start, camera_started, etc.)
 * event_data  — optional arbitrary JSON payload (no PII allowed by convention).
 */
const EventSchema = z.object({
  session_id: z.string().uuid(),
  event_type: z.string().min(1).max(64).regex(/^[a-z_]+$/),
  event_data: z.record(z.unknown()).optional().default({}),
});

const ALLOWED_EVENTS = new Set([
  "session_start",
  "camera_started",
  "item_added",
  "scanner_mode_toggled",
  "session_end",
]);

/**
 * POST /api/analytics/event
 *
 * Receives a single analytics event from the frontend.
 * - Validates input with Zod.
 * - Inserts into activity_log.
 * - Upserts into user_log (incrementing page_views or items_scanned as appropriate).
 * - Returns 204 No Content on success.
 * - There is intentionally NO GET endpoint — table contents are not readable from the browser.
 */
router.post("/analytics/event", analyticsLimiter, async (req: Request, res: Response) => {
  const parsed = EventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
    return;
  }

  const { session_id, event_type, event_data } = parsed.data;

  if (!ALLOWED_EVENTS.has(event_type)) {
    res.status(400).json({ error: "Unknown event_type" });
    return;
  }

  const ua       = (req.headers["user-agent"] ?? "").slice(0, 200);
  const referrer = (req.headers["referer"] ?? "").slice(0, 512);

  const isItem    = event_type === "item_added";
  const isNewPage = event_type === "session_start";

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO activity_log (session_id, event_type, event_data)
         VALUES ($1, $2, $3)`,
        [session_id, event_type, JSON.stringify(event_data)],
      );

      await client.query(
        `INSERT INTO user_log (session_id, first_seen, last_seen, page_views, items_scanned, user_agent, referrer)
         VALUES ($1, NOW(), NOW(), $2, $3, $4, $5)
         ON CONFLICT (session_id) DO UPDATE
           SET last_seen     = NOW(),
               page_views    = user_log.page_views    + $2,
               items_scanned = user_log.items_scanned + $3`,
        [session_id, isNewPage ? 1 : 0, isItem ? 1 : 0, ua, referrer],
      );

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    res.status(204).end();
  } catch (err) {
    req.log?.error({ err }, "analytics insert failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
