import crypto from "node:crypto";

import type { Session, User, UserMeta } from "../dataBase/schema";
import type { LoginResponse } from "../types/type";

import { generateId, comparePassword, hashPassword } from "./utils";

import { UserService } from "./user";
import { SessionService } from "./session";
import { RoomsService } from "./room";
import { RoomMembersService } from "./room_member";
import { PostService } from "./post";
import { MessageService } from "./message";
import { ItemsService } from "./items";
import { EntityService } from "./entities";
import { AuditService } from "./Audit";
import { LogisticsService } from "./logistic";
import { DisputesService } from "./Dispute";
import { db } from "../dataBase/db";
import { en } from "zod/locales";

const userService = new UserService();
const sessionService = new SessionService();
const roomsService = new RoomsService();
const roomMembersService = new RoomMembersService();
const postService = new PostService();
const messageService = new MessageService();
const logisticsService = new LogisticsService();
const itemService = new ItemsService();
const disputeService = new DisputesService();
const entityService = new EntityService();
const auditService = new AuditService();

export class AuthService {

  private generateSecureToken(): string {
    return crypto.randomBytes(48).toString("hex");
  }

  private generateExpiry(days = 7): Date {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  // ========================================================
  // SESSION CORE
  // ========================================================

  async createSession(userId: string) {
    try {

      const result = await sessionService.createSession({
        entity_id: userId,
        token: this.generateSecureToken(),
        expires_at: this.generateExpiry(7)
    });

      return { msg: "success", ans: result.ans };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  // ========================================================
  // REGISTER
  // ========================================================

  async registerUser(data: {
    email: string;
    password: string;
    registration_number: string;
    metadata: UserMeta;
  }) {
    try {

      const existing = await userService.getUserByEmail(data.email);

      if (existing.ans) {
        return { msg: "Email already in use", ans: null };
      }

      const result =  await db.transaction(async (tx)=>{

        const hash = await hashPassword(data.password);

        const entity = await entityService.useCreate(tx,{
          id: generateId('user'),
          type: "user",
          created_at: new Date(),
          updated_at: null,
        });
        if(!entity) throw new Error("auth-service: failed to create entity"); // rollback

        const user = await userService.useCreate(tx, {
          id: entity.id,
          created_at: new Date(),
          updated_at:new Date(),
          is_deleted: false,
          deleted_at: null,
          email: data.email,
          password: hash,
          registration_number: data.registration_number,
          role: "user",
          metadata: data.metadata
        })
        if(!user) throw Error("failed to reate the user"); // roolback


        await auditService.useCreate(tx, {
          id: generateId("audit"),
          entity_id: entity.id,
          action: "CREATE_USER",
          flag: "log",
          detail: `User of Email: ${data.email} is created ; time: ${new Date()}`
        })

        return { entity, user}
      })

      const session = await this.createSession(result.entity.id);

      return {
        msg: "success",
        ans: {
          entity: result.entity,
          user: result.user,
          session
        }
      };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  // ========================================================
  // LOGIN
  // ========================================================

  async loginUser(email: string, password: string) {
    try {
      const user = await userService.getUserByEmail(email);

      if (!user.ans) return { msg: "Invalid credentials", ans: null };

    const isMatch = await comparePassword(password, user.ans.password);

    if (!isMatch) return { msg: "Invalid credentials", ans: null };

      const session = await this.createSession(user.ans.id);

      await auditService.createAuditLog({
        entity_id: user.ans.id,
        action: "LOGIN",
        flag: "log",
        detail: `User of Email: ${email} logged in ; time: ${new Date()}`
      })

      return {
        msg: "success",
        ans: {
          user: user.ans,
          session
        }
      };
    } catch (e: any) {
      return { msg:"auth service "+ e.message, ans: null };
    }
  }

  // ========================================================
  // LOGOUT
  // ========================================================

  async logout(token: string) {
    try {
      const result = await sessionService.revokeSession(token);
      if(!result.ans) return { msg: "Invalid token", ans: null };

      return { msg: "success", ans: result.ans };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }


}
