import { type Request, type Response } from "express";
import { UserService } from "../services/user";
import { type AuthRequest } from "../types/request";
import type { User, UserMeta } from "../dataBase/schema";

const userService = new UserService();

export class UserController {
  /**
   * GET /users/:id
   */
  static async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const actor = (req as AuthRequest).userContext?.entity_id;
      if (!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

      if (!id) {
        return res.status(400).json({ msg: "Missing user id", ans: null });
      }

      const result = await userService.getUserById(id as string, actor);

      if (!result.ans) {
        return res.status(404).json({ msg: result.msg, ans: null });
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const actor = (req as AuthRequest).userContext?.entity_id;
      if (!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

      const result = await userService.me(actor);

      if (!result.ans) {
        return res.status(404).json({ msg: result.msg, ans: null });
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  /**
   * GET /users
   */
  static async listUsers(req: Request, res: Response) {
    try {
      let limit = Number(req.query.limit);
      let offset = Number(req.query.offset);

      if (!Number.isFinite(limit) || limit <= 0) limit = 10;
      if (!Number.isFinite(offset) || offset < 0) offset = 0;

      limit = Math.min(limit, 50);

      const result = await userService.GetAll(limit, offset);

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: [] });
    }
  }

  /**
   * PATCH /users/:id
   */
  static async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!req.userContext) {
        return res.status(401).json({ msg: "Unauthorized", ans: null });
      }

      if (req.userContext.entity_id !== id) {
        return res.status(403).json({ msg: "Forbidden", ans: null });
      }

      const patch = req.body;

      const result = await userService.updateUser(id, patch as Partial<User>);

      if (!result.ans) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  static async updateMyProfile(req: AuthRequest, res: Response) {
  try {
    const actorId = req.userContext?.entity_id;
    if (!actorId) {
      return res.status(401).json({ msg: "Unauthorized", ans: null });
    }

    const patch = req.body || {};

    // 1. Structural Security Guardrails: Strip account role or permission manipulation attempts
    if (patch.role) delete patch.role;
    if (patch.id) delete patch.id;
    if (patch.email) delete patch.email;
    if (patch.password) delete patch.password;
    if (patch.registration_number) delete patch.registration_number;

    if (patch.metadata?.permissions) {
      delete patch.metadata.permissions;
    }

    // 2. Invoke transaction service block execution pipeline
    const result = await userService.updateUser(actorId, patch);

    if (!result.ans) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}


  /**
   * PUT /users/:id/image
   */
  static async updateUserImage(req: AuthRequest, res: Response) {
  try {
    // 1. Authenticate context extraction
    const actorId = req.userContext?.entity_id;
    if (!actorId) {
      return res.status(401).json({ msg: "Unauthorized", ans: null });
    }

    // 2. Validate file stream payload presence
    if (!req.file?.buffer) {
      return res.status(400).json({ msg: "Missing image buffer file upload", ans: null });
    }

    // 3. Execute service data pipeline
    const result = await userService.updateUserImage(actorId, req.file.buffer);

    if (!result.ans) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}


  /**
   * PATCH /users/:id/role
   */
  static async updateRole(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!req.userContext) {
        return res.status(401).json({ msg: "Unauthorized", ans: null });
      }

      if (!role) {
        return res.status(400).json({ msg: "Missing role", ans: null });
      }

      const result = await userService.updateUser(id as string, { role } as any);

      if (!result.ans) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  /**
   * DELETE /users/:id
   */
  static async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!req.userContext) {
        return res.status(401).json({ msg: "Unauthorized", ans: null });
      }

      if (req.userContext.entity_id !== id) {
        return res.status(403).json({ msg: "Forbidden", ans: null });
      }

      const result = await userService.deleteUser(id);

      if (!result.ans) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }
}
