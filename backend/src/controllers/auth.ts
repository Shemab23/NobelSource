import type { Request, Response } from "express";
import { AuthService } from "../services/auth";
import type { AuthRequest } from "../types/request";
import { CloudinaryService } from "../services/cloudnary";
import type { PermissionStatus, User, UserMeta } from "../dataBase/schema";
import { setSessionCookie, clearSessionCookie } from "../services/utils";

const authService = new AuthService();

export class AuthController {

  static async register(req: Request, res: Response) {
    try {
      const ReqAuth = req as AuthRequest;
      const { email, password, registration_number } = req.body;

      if (!email || !password || !registration_number) {
        return res.status(400).json({ msg: "Missing required fields", ans: null });
      }

      let metadata: Pick<UserMeta,"permissions"|"profile">|undefined;
      let permissionNames: string[] = [];
      let permissions: User['metadata']['permissions'] = [];

      try {
        if (req.body.permission_names) {
          permissionNames = JSON.parse(req.body.permission_names);

          permissions = Array.from({ length: permissionNames.length }).map(() => ({
            status: "pending" as PermissionStatus
          })) as User['metadata']['permissions'];
        }

        if (req.body.profile) metadata = {
          profile: { ...JSON.parse(req.body.profile) },
          permissions
        };
      } catch (e: any) {
        return res.status(400).json({ msg: "Invalid JSON format in payloads: " + e.message, ans: null });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const profileFile = files?.display_image?.[0];
      const permissionFiles = files?.permissions || [];

      if (permissionFiles.length > 0 && permissionNames.length !== permissionFiles.length) {
        return res.status(400).json({ msg: "Permission names count must match uploaded files count", ans: null });
      }

      if (profileFile) {
        const uploadedProfile = await CloudinaryService.uploadBuffer(profileFile.buffer, "users/profile");
        if(metadata){
          metadata.profile = { ...(metadata.profile || {}), image: uploadedProfile.url };
        } else {
          throw Error("Auth-controller: profile image was not initialized.")
        }
      }

      if (permissionFiles.length > 0 && metadata) {
        const existingPermissions = metadata.permissions as User['metadata']['permissions'];

        if(!existingPermissions) throw Error('provide the permission ')

        metadata.permissions = await Promise.all(
          permissionFiles.map(async (file, index) => {
            const uploadedDoc = await CloudinaryService.uploadBuffer(file.buffer, "users/permissions");
            const existingItem = existingPermissions[index];

            return {
              ...existingItem,
              right: permissionNames[index] ?? "unknown!",
              document: uploadedDoc.url,
              status: existingItem?.status ?? "pending",
              by: existingItem?.by || "system"
            };
          })
        );
      }

      if (!metadata){
        throw Error("failed to create the meatadata");
      }

      const result = await authService.registerUser({
        email,
        password,
        registration_number,
        metadata
      });

      if (!result.ans?.session?.ans) {
        return res.status(400).json({ msg: result.msg || "Registration failed", ans: null });
      }

      const sessionData = result.ans.session.ans;

      // This is fine to leave as-is for the direct response loop
      ReqAuth.userContext = {
        ...result.ans.session.ans,
        isAdmin: result.ans.user.role === "admin"
      };

      setSessionCookie(res, sessionData.token, sessionData.expires_at);

      return res.status(201).json({ msg: result.msg, ans: result.ans });

    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const ReqAuth = req as AuthRequest;
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ msg: "Missing credentials", ans: null });
      }

      const result = await authService.loginUser(email, password);

      if (!result.ans || !result.ans.user || !result.ans.session.ans) {
        return res.status(401).json({ msg: result.msg, ans: null });
      }

      const sessionData = result.ans.session.ans;

      // Keeping this populates context immediately for this initial routing cycle
      ReqAuth.userContext = {
        ...result.ans.session.ans,
        isAdmin: result.ans.user.role === "admin"
      };

      setSessionCookie(res, sessionData.token, sessionData.expires_at);

      return res.status(200).json({
        msg: result.msg,
        ans: result.ans
      });

    } catch (e: any) {
      return res.status(500).json({ msg: "auth controller" + e.message, ans: null });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const ReqAuth = req as AuthRequest;
      const token = ReqAuth.cookies?.session_token;

      if (!token) {
        return res.status(400).json({ msg: "No token provided", ans: null });
      }

      const result = await authService.logout(token);

      if (!result.ans) {
        return res.status(404).json({ msg: result.msg, ans: null });
      }

      clearSessionCookie(res);
      ReqAuth.userContext = undefined;

      return res.status(200).json({
        msg: result.msg,
        ans: result.ans
      });

    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }
}
