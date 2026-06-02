import { and, eq } from "drizzle-orm";
import { db } from "../dataBase/db";
import { users, type User, type UserMeta } from "../dataBase/schema";
import { comparePassword, generateId } from "./utils";
import { EntityService } from "./entities";
import { CloudinaryService } from "./cloudnary";
import { AuditService } from "./Audit";

const entityService = new EntityService();
const auditService = new AuditService();


export class UserService {
  private table = users;

  // ========================================================
  // CORE LOWER-LEVEL DATABASE METHODS (PRIVATE PRIMITIVES)
  // ========================================================

  private async _create(client: any, values: User): Promise<User> {
    const result = await client
      .insert(this.table)
      .values(values)
      .returning();

    if (!result || result.length === 0 || !result) {
      throw new Error("Database execute failed: User insert returned empty data array.");
    }
    return result;
  }

  private async _update(client: any, id: string, values: Partial<User>): Promise<User> {
    const result = await client
      .update(this.table)
      .set({
        ...values,
        updated_at: new Date(),
      })
      .where(eq(this.table.id, id))
      .returning();

    if (!result || result.length === 0 || !result) {
      throw new Error(`Database execution tracking mismatch: Update failed or target User ID ${id} not found.`);
    }
    return result;
  }

  private async _getById(client: any, id: string): Promise<User> {
    const [result] = await client
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), eq(this.table.is_deleted, false)))
      .limit(1);

    if (!result || result.length === 0 || !result) {
      throw new Error(`Database fetch failed: Target User ID "${id}" was not found.`);
    }
    return result;
  }

  private async _getByEmail(client: any, email: string): Promise<User> {
    const [result] = await client
      .select()
      .from(this.table)
      .where(and(eq(this.table.email, email), eq(this.table.is_deleted, false)))
      .limit(1);

    if (!result || result.length === 0 || !result) {
      throw new Error(`Database fetch failed: User with email "${email}" was not found.`);
    }
    return result;
  }

  private async _getAll(client: any, limit: number, offset: number): Promise<User[]> {
    const result = await client
      .select()
      .from(this.table)
      .where(eq(this.table.is_deleted, false))
      .limit(limit)
      .offset(offset);

    if (!result) {
      throw new Error("User selection returned an invalid execution context.");
    }
    return result;
  }

  private async _delete(client: any, id: string): Promise<User> {
    const result = await client
      .update(this.table)
      .set({
        is_deleted: true,
        deleted_at: new Date(),
        updated_at: new Date()
      })
      .where(eq(this.table.id, id))
      .returning();

    if (!result || result.length === 0 || !result) {
      throw new Error(`Database execution tracking mismatch: Deletion failed or target User ID ${id} not found.`);
    }
    return result;
  }

  // ========================================================
  // TRANSACTION HOOKS (PUBLIC EXTERNAL HOOKS)
  // ========================================================

  async useCreate(client: any, values: User): Promise<User> {
    return await this._create(client, values);
  }

  async useUpdate(client: any, id: string, values: Partial<User>): Promise<User> {
    return await this._update(client, id, values);
  }

  async useGetById(client: any, id: string): Promise<User> {
    return await this._getById(client, id);
  }

  async useDelete(client: any, id: string): Promise<User> {
    return await this._delete(client, id);
  }

  // ========================================================
  // HIGH-LEVEL COMPOSITE WORKFLOWS (PUBLIC BUSINESS LOGIC)
  // ========================================================


  async createUser(data: Omit<User, "id" | "created_at" | "updated_at" | "is_deleted" | "deleted_at">) {
  try {
    return await db.transaction(async (tx) => {
      const id = generateId("user");
      if (!id) throw new Error("Id generation engine failed.");

      // 1. Call your automated service wrapper! Pass 'tx' to stick to the transaction context.
      const entityResult = await entityService.createEntity("user",id);
      if (!entityResult.ans) throw new Error(entityResult.msg);

      // 2. Save your specific user row details
      const userPayload: User = {
        ...data,
        id,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
        deleted_at: null
      };

      const user = await this._create(tx, userPayload);

      // 3. Save your user specific changes audit log entry
      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: id,
        action: "CREATE",
        flag: "log",
        detail: JSON.stringify({ email: data.email })
      });

      return { msg: "success", ans: user };
    });
  } catch (e: any) {
    return { msg: `Creation failed and rolled back: ${e.message}`, ans: null };
  }
}

async me (id: string) {
  try {
    const user = await this._getById(db, id);
    return { msg: "success", ans: user };
  } catch (e: any) {
    return { msg: e.message, ans: null };
  }
}


  async isAdmin(id: string) {
    try {
      const user = await this._getById(db, id);
      return { msg: "success", ans: user.role === "admin" };
    } catch (e: any) {
      return { msg: `failed: ${e.message}`, ans: false };
    }
  }

  async validPassword(password: string, hash: string) {
    try {
      const isValid = await comparePassword(password, hash);
      return { msg: "success", ans: isValid };
    } catch (e: any) {
      return { msg: e.message, ans: false };
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this._getByEmail(db, email);
      return { msg: "success", ans: user };
    } catch (e: any) {
      return { msg:"user service"+ e.message, ans: null };
    }
  }

  async getUserById(id: string, actor: string) {
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Fetch user record inside the transaction context
      const userRecord = await this._getById(tx, id);
      if (!userRecord) return { msg: "not_found", ans: null };

      // 2. Create Audit Log entry recording what the user did inside the transaction block
      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: actor,
        action: "READ",
        flag: "info",
        detail: `User ${actor} viewed profile details for user account ${id}.`,
      });

      return { msg: "success", ans: userRecord };
    });

    return result;
  } catch (e: any) {
    return { msg: e.message, ans: null };
  }
}


  async updateUser(id: string, patch: any) {
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Fetch current stored user state
      const existing = await this._getById(tx, id);
      if (!existing) throw new Error("User profile not found");

      const oldMeta = existing.metadata || {};
      const newMeta = patch.metadata || {};

      const oldProfile = oldMeta.profile || {};
      const newProfile = newMeta.profile || {};

      // 2. Explicit multi-level spread construction
      const updateData = {
        ...existing,         // Spread old root fields (id, password, created_at, etc.)
        ...patch,            // Overwrite with allowed root fields from patch
        metadata: {
          ...oldMeta,        // Spread old inner metadata fields (retaining ratings, permissions)
          ...newMeta,        // Overwrite with incoming metadata parameters
          profile: {
            ...oldProfile,   // Spread old profile keys (name, website, etc.)
            ...newProfile    // Overwrite with updated user profile entries cleanly
          }
        }
      };

      // 3. Persist the explicitly combined object back to your database row
      const updated = await this._update(tx, id, updateData as any);

      // 4. Log detailed history using the user id as the responsible actor for auditing
      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: id,
        action: "UPDATE",
        flag: "info",
        detail: `User ${id} successfully updated their profile configurations.`
      });

      return updated;
    });

    return { msg: "success", ans: result };
  } catch (e: any) {
    return { msg: `Update failed and rolled back: ${e.message}`, ans: null };
  }
}


  async updateUserImage(id: string, buffer: Buffer) {
  try {
    return await db.transaction(async (tx) => {
      // 1. Retrieve the existing user profile record inside the active transaction context
      const existing = await this._getById(tx, id);
      if (!existing) throw new Error("User record target not found");

      // 2. Clear old profile pictures out of Cloudinary bucket storage if they exist
      const oldImage = existing.metadata?.profile?.image;
      if (oldImage) {
        const publicId = CloudinaryService.extractPublicId(oldImage);
        if (publicId) {
          await CloudinaryService.deleteImage(publicId);
        }
      }

      // 3. Process buffer conversion stream upload to Cloudinary engine targets
      const upload = await CloudinaryService.uploadBuffer(buffer, "users/profile");
      if (!upload?.url) {
        throw new Error("Cloudinary engine wrapper failure: invalid remote path returned.");
      }

      const oldMeta = existing.metadata || {};
      const oldProfile = oldMeta.profile || {};

      const updateData = {
        ...existing,
        metadata: {
          ...oldMeta,
          profile: {
            ...oldProfile,
            image: upload.url
          }
        }
      };

      // 5. Persist the updated configuration mapping back to the database row
      const updatedUser = await this._update(tx, id, updateData as any);

      // 6. Write tracking history logs to system audit trails
      await auditService.useCreate(tx, {
        id: generateId("audit"),
        entity_id: id,
        action: "READ",
        flag: "info",
        detail: `User ${id} successfully refreshed their profile picture asset link URL.`
      });

      return { msg: "success", ans: updatedUser };
    });
  } catch (e: any) {
    return { msg: `Image lifecycle change failed and rolled back: ${e.message}`, ans: null };
  }
}


  async GetAll(limit: number, offset: number) {
    try {
      const safeLimit = limit > 0 ? limit : 10;
      const safeOffset = offset >= 0 ? offset : 0;

      const result = await this._getAll(db, safeLimit, safeOffset);
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: [] };
    }
  }

  async deleteUser(id: string) {
    try {
      return await db.transaction(async (tx) => {
        const deletedUser = await this._delete(tx, id);

        await entityService.useDelete(tx, id);

        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: id,
          action: "DELETE",
          flag: "critical",
          detail: "{}"
        });

        return { msg: "success", ans: deletedUser };
      });
    } catch (e: any) {
      return { msg: `User deletion failed and rolled back: ${e.message}`, ans: null };
    }
  }
}
