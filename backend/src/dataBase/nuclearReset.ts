import { sql } from "drizzle-orm";
import { db } from "./db";

async function nuclearReset() {
  console.log("⚠️ NUCLEAR RESET INITIATED - WIPING SCHEMA");

  const query = sql.raw(`
    -- drop tables (ordered safely, though CASCADE handles dependencies)
    DROP TABLE IF EXISTS "disputes" CASCADE;
    DROP TABLE IF EXISTS "audit_logs" CASCADE;
    DROP TABLE IF EXISTS "sessions" CASCADE;
    DROP TABLE IF EXISTS "logistics" CASCADE;
    DROP TABLE IF EXISTS "messages" CASCADE;
    DROP TABLE IF EXISTS "items" CASCADE;
    DROP TABLE IF EXISTS "posts" CASCADE;
    DROP TABLE IF EXISTS "room_members" CASCADE;
    DROP TABLE IF EXISTS "rooms" CASCADE;
    DROP TABLE IF EXISTS "users" CASCADE;
    DROP TABLE IF EXISTS "entities" CASCADE;

    -- drop enums
    DROP TYPE IF EXISTS "user_role" CASCADE;
    DROP TYPE IF EXISTS "entity_type" CASCADE;
    DROP TYPE IF EXISTS "post_status" CASCADE;
    DROP TYPE IF EXISTS "shipment_status" CASCADE;
    DROP TYPE IF EXISTS "thread_status" CASCADE;
    DROP TYPE IF EXISTS "audit_flag" CASCADE;
    DROP TYPE IF EXISTS "message_flag" CASCADE;

    -- drop drizzle kit metadata tables to ensure a clean sync state
    DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;
    DROP TABLE IF EXISTS "drizzle.__drizzle_migrations" CASCADE;
  `);

  try {
    await db.execute(query);
    console.log("✅ NUCLEAR RESET COMPLETE - DATABASE CLEAN");
  } catch (error) {
    console.error("❌ NUCLEAR RESET FAILED:", error);
  } finally {
    process.exit(0);
  }
}

nuclearReset();
