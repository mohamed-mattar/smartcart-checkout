import { bigserial, index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const activityLog = pgTable(
  "activity_log",
  {
    id:         bigserial("id", { mode: "number" }).primaryKey(),
    sessionId:  text("session_id").notNull(),
    eventType:  text("event_type").notNull(),
    eventData:  jsonb("event_data").notNull().default({}),
    createdAt:  timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("activity_log_session_idx").on(t.sessionId),
    index("activity_log_created_idx").on(t.createdAt),
  ],
);

export const userLog = pgTable(
  "user_log",
  {
    id:           bigserial("id", { mode: "number" }).primaryKey(),
    sessionId:    text("session_id").notNull().unique(),
    firstSeen:    timestamp("first_seen",  { withTimezone: true }).notNull().defaultNow(),
    lastSeen:     timestamp("last_seen",   { withTimezone: true }).notNull().defaultNow(),
    pageViews:    integer("page_views").notNull().default(0),
    itemsScanned: integer("items_scanned").notNull().default(0),
    userAgent:    text("user_agent"),
    referrer:     text("referrer"),
  },
  (t) => [
    index("user_log_session_idx").on(t.sessionId),
  ],
);
