import { type Request, type Response } from "express";
import { RoomsService } from "../services/room";
import { type AuthRequest } from "../types/request";
import type { Room, RoomMeta, RoomContract } from "../dataBase/schema";

const roomsService = new RoomsService();

export class RoomsController {
  /**
   * POST /rooms
   */
  static async createRoom(req: AuthRequest, res: Response) {
  try {
    const actorId = req.userContext?.entity_id;
    if (!actorId) {
      return res.status(401).json({ msg: "Unauthorized", ans: null });
    }

    const { name, metadata, contract } = req.body;
    if (!name || !metadata || !contract) {
      return res.status(400).json({ msg: "Missing required fields", ans: null });
    }

    const parseObject = (field: any) => {
      if (typeof field === "string") {
        try { return JSON.parse(field); } catch { return null; }
      }
      return field;
    };

    const parsedMetadata = parseObject(metadata) as RoomMeta;
    const parsedContract = parseObject(contract) as RoomContract;

    if (!parsedMetadata || !parsedContract) {
      return res.status(400).json({ msg: "Invalid format for metadata or contract structures", ans: null });
    }

    // Replace macro "me" shortcuts with authentic user context id
    if (parsedContract.metadata) {
      if (parsedContract.metadata.provider_id === "me") parsedContract.metadata.provider_id = actorId;
      if (parsedContract.metadata.receiver_id === "me") parsedContract.metadata.receiver_id = actorId;
      if (parsedContract.signed && parsedContract.signed.includes("me")) {
  parsedContract.signed = parsedContract.signed.map(signer => signer === "me" ? actorId : signer);
}

    }

    // Secure rule setup: Clean user rules inputs to prevent unauthorized administrative escalation requests
    const filteredRules = (parsedMetadata.members_rules || []).filter(
      (rule) => rule.actor !== actorId && !rule.isAdmin && rule.role !== "admin"
    );

    parsedMetadata.members_rules = [
      ...filteredRules,
      {
        actor: actorId,
        role: "admin",
        isAdmin: true
      }
    ];

    const result = await roomsService.createRoom(
      name,
      parsedMetadata,
      parsedContract,
      actorId
    );

    if (!result.ans) return res.status(400).json(result);
    return res.status(201).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}



  /**
   * GET /rooms/:id
   */
  static async getRoomById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ msg: "Missing room id", ans: null });
      }

      const result = await roomsService.getRoomById(id as string);

      if (!result.ans) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  /**
   * GET /rooms/user/:userId
   */
  static async getMyRooms(req: Request, res: Response) {
  try {
    const actorId = (req as any).userContext?.entity_id;
    if (!actorId) {
      return res.status(401).json({ msg: "Unauthorized", ans: [] });
    }

    const result = await roomsService.getRoomsByUserId(actorId);
    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: [] });
  }
}


  /**
   * GET /rooms/:id/financials
   */
  static async getFinancials(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const actor = (req as AuthRequest).userContext?.entity_id;
      if(!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

      const result = await roomsService.getFinancialsByRoomId(id as string,actor);

      if (!result.ans) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  /**
   * GET /rooms/:id/items
   */
  static async getItems(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ msg: "Missing room id", ans: null });
      }

      const actor = (req as AuthRequest).userContext?.entity_id;
      if(!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

      const result = await roomsService.getItemsByRoomId(id as string,actor);

      if (!result.ans) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  /**
   * PATCH /rooms/:id
   */
  static async updateRoom(req: AuthRequest, res: Response) {
  try {
    const actorId = req.userContext?.entity_id;
    if (!actorId) {
      return res.status(401).json({ msg: "Unauthorized", ans: null });
    }

    const { id } = req.params ;
    if (!id) {
      return res.status(400).json({ msg: "Missing room id parameter", ans: null });
    }

    const patch = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // 1. Swap "me" references inside contract metadata arrays if present
    if (patch.contract?.metadata) {
      if (patch.contract.metadata.provider_id === "me") patch.contract.metadata.provider_id = actorId;
      if (patch.contract.metadata.receiver_id === "me") patch.contract.metadata.receiver_id = actorId;
    }
    if (patch.contract?.signed && patch.contract.signed.includes("me")) {
      patch.contract.signed = patch.contract.signed.map((signer: string) => signer === "me" ? actorId : signer);
    }

    // 2. Filter malicious attempts to manually grant administrative or privilege escalation escalations
    if (patch.metadata?.members_rules) {
      patch.metadata.members_rules = patch.metadata.members_rules.filter(
        (rule: any) => rule.actor !== actorId && !rule.isAdmin && rule.role !== "admin"
      );
    }

    const result = await roomsService.updateRoom(id as string, patch, actorId);

    if (!result.ans) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}


  /**
   * PATCH /rooms/:id/soft-delete
   */
  static async softDeleteRoom(req: AuthRequest, res: Response) {
    try {
      if (!req.userContext) {
        return res.status(401).json({ msg: "Unauthorized", ans: null });
      }

      const { id } = req.params;

      const result = await roomsService.softDeleteRoom(id as string);

      if (!result.ans) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  /**
   * GET /rooms
   */
  static async getAll(req: Request, res: Response) {
    try {
      let limit = Number(req.query.limit);
      let offset = Number(req.query.offset);

      if (!Number.isFinite(limit) || limit <= 0) limit = 10;
      if (!Number.isFinite(offset) || offset < 0) offset = 0;

      limit = Math.min(limit, 50);

      const result = await roomsService.GetAll(limit, offset);

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: [] });
    }
  }
}
