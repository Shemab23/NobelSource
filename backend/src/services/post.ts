import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../dataBase/db";
import { entities, posts, type Post, type PostContent } from "../dataBase/schema";
import { generateId } from "./utils";
import { EntityService } from "./entities";
import { AuditService } from "./Audit";

const entityService = new EntityService();
const auditService = new AuditService();

export class PostService {
  private table = posts;

  // ========================================================
  // CORE LOWER-LEVEL DATABASE METHODS (PRIVATE PRIMITIVES)
  // ========================================================

  private async _create(client: any, values: Post): Promise<Post> {
    const result = await client
      .insert(this.table)
      .values(values)
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error("Database execute failed: Post insert returned empty data array.");
    }
    return result[0];
  }

  private async _update(client: any, id: string, values: Partial<Post>): Promise<Post> {
    const result = await client
      .update(this.table)
      .set({
        ...values,
        updated_at: new Date()
      })
      .where(eq(this.table.id, id))
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error(`Database execution tracking mismatch: Update failed for Post ID ${id}.`);
    }
    return result[0];
  }

  private async _getById(client: any, id: string): Promise<Post> {
    const result = await client
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), sql`${this.table.deleted_at} IS NULL`))
      .limit(1);

    if (!result || result.length === 0 || !result[0]) {
      throw new Error(`Database fetch failed: Post with ID ${id} was not found.`);
    }
    return result[0];
  }

  private async _getAll(client: any, limit: number, offset: number): Promise<Post[]> {
    const result = await client
      .select()
      .from(this.table)
      .where(sql`${this.table.deleted_at} IS NULL`)
      .limit(limit)
      .offset(offset);

    if (!result) {
      throw new Error("Post selections returned an invalid execution context.");
    }
    return result;
  }

  private async _delete(client: any, id: string): Promise<Post> {
    const result = await client
      .delete(this.table)
      .where(eq(this.table.id, id))
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      throw new Error(`Database execution tracking mismatch: Deletion failed for Post ID ${id}.`);
    }
    return result[0];
  }

  // ========================================================
  // TRANSACTION HOOKS (PUBLIC EXTERNAL HOOKS)
  // ========================================================

  async useCreate(client: any, values: Post): Promise<Post> {
    return await this._create(client, values);
  }

  async useUpdate(client: any, id: string, values: Partial<Post>): Promise<Post> {
    return await this._update(client, id, values);
  }

  async useGetById(client: any, id: string): Promise<Post> {
    return await this._getById(client, id);
  }

  async useDelete(client: any, id: string): Promise<Post> {
    return await this._delete(client, id);
  }

  // ========================================================
  // HIGH-LEVEL COMPOSITE WORKFLOWS (PUBLIC BUSINESS LOGIC)
  // ========================================================

  /**
   * CREATE POST
   */
 async createPost(content: PostContent, entityId: string, status: Post["status"] = "active") {
  try {
    const result = await db.transaction(async (tx) => {
      const postId = generateId("post");
      if (!postId) return { msg: "Id generation failed", ans: null };

      const postPayload: Post = {
        id: postId,
        entity_id: entityId,
        content: content,
        status: status,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
        deleted_at: null
      };

      const resultPost = await this._create(tx, postPayload);

      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: entityId,
        action: "SOLO",
        flag: "info",
        detail: `User ${entityId} published a new ${content.type} listing post (ID: ${postId}) categorized as ${content.category} at price ${content.price_cents} cents.`,
      });

      return { msg: "success", ans: resultPost };
    });

    return result;
  } catch (e: any) {
    return { msg: e.message, ans: null };
  }
}



  /**
   * GET SINGLE POST BY ID
   */
  async getPostById(id: string) {
    try {
      const result = await this._getById(db, id);
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  /**
   * UPDATE POST CONTENT
   */
  async updatePost(id: string, patch: any) {
  try {
    const result = await db.transaction(async (tx) => {
      const existing = await this._getById(tx, id);
      if (!existing) throw new Error("Post not found");

      // Extract content layers for cleaner array merging code below
      const oldContent = existing.content || {};
      const newContent = patch.content || {};

      const updatedPostPayload = {
        ...existing,         // Spread old root level fields
        ...patch,            // Overwrite with root fields from patch (like status)
        content: {
          ...oldContent,     // Spread old inner content fields
          ...newContent,
          tags: [
            ...(oldContent.tags || []),
            ...(newContent.tags || [])
          ]
        }
      };

      // Clean up empty tracking arrays if neither old nor new data provided them
      if (updatedPostPayload.content.media.length === 0) delete updatedPostPayload.content.media;
      if (updatedPostPayload.content.tags.length === 0) delete updatedPostPayload.content.tags;

      return await this._update(tx, id, updatedPostPayload as any);
    });

    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: e.message, ans: null };
  }
}



  /**
   * EXPIRE / ARCHIVE POST
   */
  async archivePost(id: string) {
    try {
      const result = await db.transaction(async (tx) => {
        return await this._update(tx, id, { status: "expired" });
      });
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  /**
   * SOFT-DELETE POST
   */
  async softDeletePost(id: string) {
    try {
      const result = await db.transaction(async (tx) => {
        return await this._update(tx, id, {
          is_deleted: true,
          deleted_at: new Date()
        });
      });
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  /**
   * HARD-DELETE POST (AND ITS SYSTEM ENTITY)
   */
   async deletePost(id: string) {
    try {
      const result = await db.transaction(async (tx) => {
        const deleted = await this._delete(tx, id);

        await tx.delete(entities).where(eq(entities.id, id));

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: id,
          action: "POST_DELETED",
          flag: "critical",
          detail: {}
        } as any);

        return deleted;
      });

      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  /**
   * TEXT SEARCH POST TEXT FIELDS IN JSON CONTENT
   */
  async searchPosts(query: string, limit: number) {
    try {
      const safeLimit = limit > 0 ? limit : 10;

      const result = await db
        .select()
        .from(this.table)
        .where(
          and(
            sql`${this.table.deleted_at} IS NULL`,
            ilike(sql`(${this.table.content}::text)`, `%${query}%`)
          )
        )
        .orderBy(desc(this.table.created_at))
        .limit(safeLimit);

      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: [] };
    }
  }

  /**
   * LIST ALL ACTIVE POSTS WINDOW
   */
  async listActivePosts(limit: number = 20) {
    try {
      const safeLimit = limit > 0 ? limit : 20;

      const result = await db
        .select()
        .from(this.table)
        .where(
          and(
            eq(this.table.status, "active"),
            sql`${this.table.deleted_at} IS NULL`
          )
        )
        .orderBy(desc(this.table.created_at))
        .limit(safeLimit);

      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: [] };
    }
  }

  /**
   * ADMIN SYSTEM FEED OVERVIEW LOOPS
   */
  async getGlobalFeed(limit: number, offset: number) {
    try {
      const safeLimit = limit > 0 ? limit : 10;
      const safeOffset = offset >= 0 ? offset : 0;

      const result = await db
        .select()
        .from(this.table)
        .where(
          and(
            eq(this.table.status, "active"),
            sql`${this.table.deleted_at} IS NULL`
          )
        )
        .orderBy(desc(this.table.created_at))
        .limit(safeLimit)
        .offset(safeOffset);

      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: [] };
    }
  }
}
