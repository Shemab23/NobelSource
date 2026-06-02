import { type Request } from "express";
import type { Session } from "../dataBase/schema";

export interface AuthRequest extends Request {
  userContext?: {
    token: Session["token"];
    entity_id: Session["entity_id"];
    expires_at: Session["expires_at"];
    isAdmin: boolean;
  };
}
