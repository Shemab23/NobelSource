import { type Request, type Response } from "express";
import { AuditService } from "../services/Audit";
import { RoomMembersService } from "../services/room_member";
import type { AuthRequest } from "../types/request";

const auditService = new AuditService();
const roomMembers = new RoomMembersService();

export class AuditController {

  static async getGlobalLogs(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;

      const ReqAuth = req as AuthRequest;
      const id = ReqAuth.userContext?.entity_id;
      if(!id) return res.status(401).json({ msg: "Unauthorized", ans: null });

      const result = await auditService.getAll(limit, offset,id);

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  static async getByEntity(req: Request, res: Response) {
    try {
      const { id } = req.params;// roomId or userId

      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;

      const ReqAuth = req as AuthRequest;
      // console.log(ReqAuth.userContext);
      const meId = ReqAuth.userContext?.entity_id;
      // console.log(meId);
      if(!meId) return res.status(401).json({ msg: "Unauthorized", ans: null });

      const result = await auditService.getByEntityId(id as string, limit, offset,meId);
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  static async getByAuditId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await auditService.getById(id as string);
      return res.status(result.ans ? 200 : 404).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  static async roomAudit(req: Request, res: Response) {
    try {
      const { roomId } = req.params;

      const members = await roomMembers.getMbembersByroomId(roomId as string);

      if (!members?.length) {
        return res.status(404).json({ msg: "room empty", ans: [] });
      }

      const ids = members.map(m => m.user_id);

      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;

      const result = await auditService.getRoomTimeline(ids, limit, offset);

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  static async getSince(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;

      const since = new Date(req.query.since as string);

      const result = await auditService.getSince(since, limit, offset);
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }
}
