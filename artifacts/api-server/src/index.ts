import app from "./app";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function runMigrations(): Promise<void> {
  logger.info("Running startup migrations…");
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id         bigserial PRIMARY KEY,
        session_id text      NOT NULL,
        event_type text      NOT NULL,
        event_data jsonb     NOT NULL DEFAULT '{}',
        created_at timestamptz NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS activity_log_session_idx ON activity_log (session_id);
      CREATE INDEX IF NOT EXISTS activity_log_created_idx ON activity_log (created_at);

      CREATE TABLE IF NOT EXISTS user_log (
        id            bigserial PRIMARY KEY,
        session_id    text      NOT NULL UNIQUE,
        first_seen    timestamptz NOT NULL DEFAULT NOW(),
        last_seen     timestamptz NOT NULL DEFAULT NOW(),
        page_views    integer   NOT NULL DEFAULT 0,
        items_scanned integer   NOT NULL DEFAULT 0,
        user_agent    text,
        referrer      text
      );
      CREATE INDEX IF NOT EXISTS user_log_session_idx ON user_log (session_id);
    `);
    logger.info("Startup migrations complete");
  } finally {
    client.release();
  }
}

runMigrations()
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }
      logger.info({ port }, "Server listening");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Startup migration failed — aborting");
    process.exit(1);
  });
