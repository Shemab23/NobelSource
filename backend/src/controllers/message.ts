import { type Request, type Response } from "express";
import { MessageService } from "../services/message";
import { EntityService } from "../services/entities";
import { type AuthRequest } from "../types/request";
import type { Message ,MessageMetadata} from "../dataBase/schema";

const messageService = new MessageService();

export class MessageController {

   static async sendMessage(req: Request, res: Response) {
    try {
      const actor = (req as any).userContext?.entity_id;
      if (!actor) return res.status(401).json({ msg: "Unauthorized" });

      const { to_id, body, room_id, message_flag, participants, metadata } = req.body;

      if (typeof body !== "string" || !body.trim()) {
        return res.status(400).json({ msg: "Invalid message body" });
      }

      const allowedFlags = ["system", "notification", "proposal", "chat", "dispute"];
      const finalFlag = allowedFlags.includes(message_flag) ? message_flag : "chat";

      const result = await messageService.processSendMessage({
        sender_id: actor,
        to_id,
        room_id,
        body: body.trim(),
        flag: finalFlag as Message["flag"],
        req_participants: participants,
        metadata: metadata as Message["metadata"] ?? {}
      });

      if (result.msg === "recipient_not_found") return res.status(404).json(result);
      if (result.msg === "failed_to_create") return res.status(400).json(result);

      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message, ans: null });
    }
  }

  /**
   * PATCH /messages/:id/respond
   * Appends a response block to an existing message body using structured history indexing.
   */
  static async respondToMessage(req: Request, res: Response) {
    try {
      const actor = (req as any).userContext?.entity_id;
      if (!actor) return res.status(401).json({ msg: "Unauthorized" });

      const id = req.params.id as string;
      if (!id) return res.status(400).json({ msg: "Missing message id parameter" });

      const { body } = req.body;
      if (typeof body !== "string" || !body.trim()) {
        return res.status(400).json({ msg: "Invalid response message body" });
      }

      const result = await messageService.processRespondMessage({
        message_id: id,
        responder_id: actor,
        response_text: body.trim()
      });

      if (result.msg === "not_found") return res.status(404).json(result);
      if (result.msg === "forbidden") return res.status(403).json(result);
      if (result.msg === "failed_to_update") return res.status(400).json(result);

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message, ans: null });
    }
  }



  static async MyMessages(req: Request, res: Response) {
    try {
      const actor = (req as any).userContext?.entity_id;
    if (!actor) return res.status(401).json({ msg: "Unauthorized" });

      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;

      const result = await messageService.MyMessages(actor, limit, offset);

      const status_code = result.msg === "success" ? 200 : 500;
      return res.status(status_code).json(result);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message, ans: [] });
    }
  }

  static async MessagesInRoom(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      if (!roomId) {
        return res.status(400).json({ msg: "Missing Room ID" });
      }

      const limit = Number(req.query.limit) || 100;
      const offset = Number(req.query.offset) || 0;

      const result = await messageService.MessagesInRoom(roomId as string, limit, offset);

      const status_code = result.msg === "success" ? 200 : 500;
      return res.status(status_code).json(result);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message, ans: [] });
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    try {
      const actor = (req as any).userContext?.entity_id;
      if (!actor) return res.status(401).json({ msg: "Unauthorized" });

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ msg: "Missing ID" });
      }

      const result = await messageService.Delete(id as string,actor);

      if (result.msg !== "success") {
        return res.status(400).json({ msg: result.msg, ans: null });
      }

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({
        msg: err.message,
        ans: null
      });
    }
  }


  static async getAllMessages(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset) || 0;

      const result = await messageService.GetAll(limit, offset);

      const status_code = result.msg === "success" ? 200 : 500;
      return res.status(status_code).json(result);
    } catch (err: any) {
      return res.status(500).json({
        msg: err.message,
        ans: []
      });
    }
  }

  static async getConversation(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.userContext) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "Missing conversation id" });
    }

    const userId = authReq.userContext.entity_id;

    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const result = await messageService.GetAll(limit, offset);

    // filter conversation in-memory (temporary safe fallback)
    const filtered = result.ans.filter((m) =>
      m.participants?.includes(userId) &&
      m.participants?.includes(id as string)
    );

    return res.status(200).json({
      msg: "success",
      ans: filtered
    });

  } catch (err: any) {
    return res.status(500).json({ msg: err.message, ans: [] });
  }
}

}
