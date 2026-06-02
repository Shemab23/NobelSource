import { eq, lt, and } from "drizzle-orm";
import { db } from "../dataBase/db";
import { sessions, type Session } from "../dataBase/schema";
import { AuditService } from "./Audit"; // Importing unified service
import { generateId } from "./utils";

const auditService = new AuditService();

export class SessionService {
  private table = sessions;

  /**
   * CREATE SESSION
   */
  async createSession(data: Session) {
    try {
      return await db.transaction(async (tx) => {
        const [result] = await tx
          .insert(this.table)
          .values(data)
          .returning();

        // Safe atomic creation log entry
        await auditService.useCreate(tx,{
          id: generateId("audit"),
          entity_id: data.entity_id,
          action: "SESSION_CREATE" as any,
          flag: "info",
          detail:`expires_at: ${data.expires_at}`
        });

        return { msg: "success", ans: result };
      });
    } catch (e: any) {
      console.error("SESSION INSERT FAILED:", e);
      return {
        msg: e.message,
        ans: null
      };
    }
  }

  /**
   * GET SESSION BY TOKEN
   */
  async getSessionByToken(token: Session["token"]) {
    try {
      const [result] = await db
        .select()
        .from(this.table)
        .where(eq(this.table.token, token))
        .limit(1);

      return { msg: result ? "success" : "not_found", ans: result };
    } catch (e: any) {
      return { msg: `getSessionByToken failed: ${e.message}`, ans: null };
    }
  }

  /**
   * EXTEND SESSION (renew expiry)
   */
  async extendSession(token: Session["token"]) {
    try {
      return await db.transaction(async (tx) => {
        const newExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24);

        const [result] = await tx
          .update(this.table)
          .set({ expires_at: newExpiry })
          .where(eq(this.table.token, token))
          .returning();

        if (result) {
          await auditService.useCreate(tx,{
            id: generateId("audit"),
            entity_id: result.entity_id,
            action: "SESSION_EXTEND" as any,
            flag: "info",
            detail: ` extended_expiry: ${newExpiry}`
          });
        }

        return { msg: result ? "success" : "not_found", ans: result };
      });
    } catch (e: any) {
      return { msg: `extendSession failed: ${e.message}`, ans: null };
    }
  }

  /**
   * VALIDATE SESSION (auth gate)
   */
  async validateSession(token: string) {
    try {
      const [session] = await db
        .select()
        .from(this.table)
        .where(eq(this.table.token, token))
        .limit(1);

      if (!session) {
        return { msg: "validate session fail ; invalid_token", ans: null };
      }

      if (session.expires_at < new Date()) {
        await this.revokeSession(token);
        return { msg: "session_expired", ans: null };
      }

      return { msg: "valid", ans: session };
    } catch (e: any) {
      return { msg: `validateSession failed: ${e.message}`, ans: null };
    }
  }

  /**
   * REVOKE SESSION
   */
  async revokeSession(token: Session["token"]) {
    try {
      return await db.transaction(async (tx) => {
        const [result] = await tx
          .delete(this.table)
          .where(eq(this.table.token, token))
          .returning();

        if (result) {
          await auditService.useCreate(tx,{
            id: generateId("audit"),
            entity_id: result.entity_id,
            action: "LOGOUT",
            flag: "log",
            detail: `session of token ${token} revoked & logout; time: ${new Date()}`
          });
        }

        return { msg: result ? "success" : "not_found", ans: result };
      });
    } catch (e: any) {
      return { msg: `revokeSession failed: ${e.message}`, ans: null };
    }
  }

  /**
   * REVOKE ALL USER SESSIONS
   */
  async revokeAllUserSessions(entity_id: Session["entity_id"]) {
    try {
      return await db.transaction(async (tx) => {
        const result = await tx
          .delete(this.table)
          .where(eq(this.table.entity_id, entity_id))
          .returning();

        await auditService.useCreate(tx,{
          id: generateId("audit"),
          entity_id: entity_id,
          action: "SESSION_REVOKE_ALL" as any,
          flag: "info",
          detail: `dropped sessions count: ${result.length}`
        });

        return { msg: "success", count: result.length };
      });
    } catch (e: any) {
      return { msg: `revokeAllUserSessions failed: ${e.message}`, ans: null };
    }
  }

  /**
   * PURGE EXPIRED SESSIONS
   */
  async purgeExpiredSessions() {
    try {
      return await db.transaction(async (tx) => {
        const now = new Date();

        const result = await tx
          .delete(this.table)
          .where(lt(this.table.expires_at, now))
          .returning();

        if (result.length > 0) {
          await auditService.useCreate(tx,{
            id: generateId("audit"),
            entity_id: "sys_session_manager",
            action: "SESSION_PURGE" as any,
            flag: "info",
            detail: `purged sessions count: ${result.length}`
          });
        }

        return {
          msg: "success",
          count: result.length
        };
      });
    } catch (e: any) {
      return { msg: `purgeExpiredSessions failed: ${e.message}`, count: 0 };
    }
  }

  /**
   * GET ALL SESSIONS
   */
  async GetAll(limit: number, offset: number) {
    try {
      const safeLimit = (limit && limit > 0) ? limit : 10;
      const safeOffset = (offset && offset >= 0) ? offset : 0;

      const result = await db
        .select()
        .from(this.table)
        .limit(safeLimit)
        .offset(safeOffset);

      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }
}
