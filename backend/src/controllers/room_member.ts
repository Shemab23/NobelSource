import { type Response, type Request } from "express";
import { type AuthRequest } from "../types/request";
import { RoomMembersService } from "../services/room_member";
import { UserService } from '../services/user';
import type { RoomMember,Room,User,RoomMeta,RoomContract,UserMeta} from "../dataBase/schema";
import { RoomsService } from "../services/room";

const roomMembersService = new RoomMembersService();
const roomService = new RoomsService();
const userService = new UserService();

export class RoomMemberController {


  static async joinRoom(req: AuthRequest, res: Response) {
  try {
    const actor = req.userContext?.entity_id;
    if (!actor) return res.status(401).json({ msg: "Unauthorized" });

    const roomId = req.params.id as string;
    if (!roomId) return res.status(400).json({ msg: "Missing room id parameter" });

    // Single call to the consolidated service transaction
    const result = await roomMembersService.joinRoomTransaction(roomId, actor);

    if (result.msg === "already_member") return res.status(400).json(result);
    if (result.msg === "failed_to_join") return res.status(400).json(result);

    return res.status(201).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}



  static async addMember(req: AuthRequest, res: Response) {
  try {
    const { id: roomId } = req.params;
    const { user_id: targetUserId } = req.body;
    const authReq = req;

    if (!authReq.userContext) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!roomId || !targetUserId) {
      return res.status(400).json({ msg: "Missing data" });
    }

    const roomResult = await roomService.getRoomById(roomId as string);
    const room = roomResult.ans;

    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    const isAdmin =
      room.metadata?.members_rules?.some(
        (m: any) =>
          m.actor === authReq.userContext?.entity_id && m.isAdmin === true
      ) ?? false;

    if (!isAdmin) {
      return res.status(403).json({ msg: "Only room admin can add members" });
    }

    const result = await roomMembersService.addMemberSafe(roomId  as string, targetUserId  as string);

    if (result.msg !== "success") {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}


  static async RoomMembers(req: Request, res: Response) {
  try {
    const roomId  = req.params.id as string;
    const actor = (req as AuthRequest).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });

    if (!roomId) {
      return res.status(400).json({ msg: "Missing room id parameter" });
    }

    const result = await roomMembersService.getMembersByRoomId(roomId  as string);

    if (!result.ans || result.ans.length === 0) {
      return res.status(200).json([]);
    }

    const hydratedUsers = await Promise.all(
      result.ans.map(async (member) => {
        try {
          const userFetch = await userService.getUserById(member.user_id, actor);

          if (!userFetch?.ans) return null;

          return {
            id: userFetch.ans.id,
            regNumber: userFetch.ans.registration_number,
            metadata: userFetch.ans.metadata
          };
        } catch {
          return null;
        }
      })
    );

    return res.status(200).json(hydratedUsers.filter(Boolean));
  } catch (e: any) {
    return res.status(500).json({ msg: e.message || e, ans: null });
  }
}


  static async removeMember(req: AuthRequest, res: Response) {
  try {
    const { id: roomId } = req.params;
    const { user_id: targetUserId } = req.body;

    if (!req.userContext) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!roomId || !targetUserId) {
      return res.status(400).json({ msg: "Missing data" });
    }

    const result = await roomMembersService.revokeMember(roomId as string, targetUserId as string);

    if (result.msg !== "success") {
      return res.status(404).json({
        msg: "Member association not found or already revoked"
      });
    }

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}


  static async updateMemberRole(req: AuthRequest, res: Response) {
  try {
    const { id: roomId, userId: targetUserId } = req.params;
    const patchPayload = req.body;

    if (!req.userContext) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!roomId || !targetUserId) {
      return res.status(400).json({ msg: "Missing identifier details" });
    }

    const result = await roomMembersService.updateMember(
      roomId as string,
      targetUserId  as string,
      patchPayload
    );

    if (result.msg !== "success") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}


  static async getAllMembersPagination(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const actor = (req as any).userContext?.entity_id;
      if(!actor) return res.status(401).json({ msg: "Unauthorized" });

      const result = await roomMembersService.GetAll(limit, offset, actor);
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({
        msg: e.message,
        ans: []
      });
    }
  }
}
