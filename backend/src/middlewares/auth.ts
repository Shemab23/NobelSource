import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/request";
import { SessionService } from "../services/session";
import { setSessionCookie, clearSessionCookie } from "../services/utils";
import { UserService } from "../services/user";

const sessionService = new SessionService();
const userService = new UserService();

export const authGuard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.session_token;

    if (!token) {
      return res.status(401).json({ msg: "Authentication required", ans: null });
    }

    const result = await sessionService.validateSession(token);

    if (!result.ans) {
      clearSessionCookie(res);
      return res.status(401).json({ msg: result.msg || "Invalid session", ans: null });
    }

    const session = result.ans;




    const detail = await userService.getUserById(session.entity_id,"USR_ADMIN001"); // i was blocked i have to create system user, who is responsible for anything automatic no admin

    // console.log(detail);
    if(!detail.ans) return res.status(401).json({ msg: "Invalid session", ans: null });

    req.userContext = {
      ...session,
      isAdmin: detail.ans.role === "admin"? true : false
    };

    setSessionCookie(res, session.token, session.expires_at);

    next();
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
};
