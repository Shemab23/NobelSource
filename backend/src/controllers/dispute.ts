import { type Request, type Response } from "express";
import { DisputesService } from "../services/Dispute";
import type { AuthRequest } from "../types/request";
import { RoomMembersService } from '../services/room_member';
import type { Dispute } from "../dataBase/schema";

const disputesService = new DisputesService();
const roomMembersService = new RoomMembersService();

export class DisputesController {

  static async raise(req: Request, res: Response) {
    try {
      const {
        room_id,
        logistics_id,
        claim,
        arbitrator
      } = req.body;

      if (
        !room_id ||
        !logistics_id ||
        !claim
      ) {
        return res.status(400).json({
          msg: "Missing required fields",
          ans: null
        });
      }

      const opened_by = (req as AuthRequest ).userContext?.entity_id;

      if( ! opened_by ) return res.status(401).json({ msg: "Unauthorized", ans: null });

      const member = await roomMembersService.isMember(
        room_id as string,
        opened_by
      );


      let safeArbitrator = undefined;

        if (arbitrator){safeArbitrator = await roomMembersService.isMember(
          room_id as string,
          arbitrator
        );
      }

      if( member.ans === false ) return res.status(401).json({ msg: "Unauthorized: only members of the room can raise the dipute", ans: null });
      if(safeArbitrator && safeArbitrator.ans === true ) return res.status(401).json({ msg: "Unauthorized: you can not arbitrate for yourself", ans: null });

      const result = await disputesService.raiseDispute({
        room_id,
        logistics_id,
        opened_by,
        claim,
        arbitrator_id: arbitrator??null
      });

      return res.status(201).json({
        msg: "success",
        ans: result
      });

    } catch (e: any) {
      return res.status(500).json({
        msg: e.message,
        ans: null
      });
    }
  }

  static async assign(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { arbitrator_id } = req.body;

      if (!id || !arbitrator_id) {
        return res.status(400).json({
          msg: "Missing required fields",
          ans: null
        });
      }

      const actor = (req as AuthRequest ).userContext?.entity_id;

      if (!actor) {
        return res.status(403).json({
          msg: "Forbidden, log in first",
          ans: null
        });
      }

      const result = await disputesService.assignArbitrator(
        id  as string,
        arbitrator_id,
        actor
      );

      return res.status(200).json({
        msg: "success",
        ans: result
      });

    } catch (e: any) {
      return res.status(500).json({
        msg: e.message,
        ans: null
      });
    }
  }

  static async judgement(req: Request, res: Response) { // "open", "investigating", "resolved", "rejected"
    try {
      const { id } = req.params;

      const {
        resolution,
        status
      } = req.body;

      const arbitrator_id = (req as AuthRequest ).userContext?.entity_id;
      if(! arbitrator_id ) return res.status(401).json({ msg: "Unauthorized", ans: null });

      if (
        !id ||
        !resolution ||
        !status
      ) {
        return res.status(400).json({
          msg: "Missing required fields",
          ans: null
        });
      }

      if(status !== "resolved" && status !== "rejected" ) return res.status(400).json({ msg: "Invalid status, must be resolved or rejected", ans: null });

      const result = await disputesService.submitJudgement({
        dispute_id: id as string,
        arbitrator_id,
        resolution,
        status
      });

      return res.status(200).json({
        msg: "success",
        ans: result
      });

    } catch (e: any) {
      return res.status(500).json({
        msg: e.message,
        ans: null
      });
    }
  }


 static async rate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const rated_by = (req as AuthRequest).userContext?.entity_id;

    // 1. Check authentication
    if (!rated_by) {
      return res.status(401).json({ msg: "Unauthorized", ans: null });
    }

    // 2. Validate input fields early
    if (!id || rating === undefined) {
      return res.status(400).json({ msg: "Missing required fields", ans: null });
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5", ans: null });
    }

    // 3. Check room membership permissions
    const dispute = await disputesService.getDisputeById(id as string);
    if (!dispute) {
      return res.status(444).json({ msg: "Dispute not found", ans: null });
    }

    const isAllowed = await roomMembersService.isMember(dispute.room_id, rated_by);
    if (!isAllowed) {
      return res.status(403).json({ msg: "Forbidden: You are not a member of this room", ans: null });
    }

    // 4. Execute rating
    const result = await disputesService.rateService({
      dispute_id: id as string,
      rated_by,
      rating: numericRating,
      review
    });

    return res.status(200).json({ msg: "success", ans: result });

  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}




  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          msg: "Missing dispute id",
          ans: null
        });
      }

      const result = await disputesService.getDisputeById(id as string);

      return res.status(200).json({
        msg: "success",
        ans: result
      });

    } catch (e: any) {
      return res.status(404).json({
        msg: e.message,
        ans: null
      });
    }
  }

  static async getRoom(req: Request, res: Response) {
    try {
      const { room_id } = req.params;

      if (!room_id) {
        return res.status(400).json({
          msg: "Missing room id",
          ans: []
        });
      }

      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;

      const result = await disputesService.getRoomDisputes(
        room_id as string,
        limit,
        offset
      );

      return res.status(200).json({
        msg: "success",
        ans: result
      });

    } catch (e: any) {
      return res.status(500).json({
        msg: e.message,
        ans: []
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;

      const result = await disputesService.getAll(
        limit,
        offset
      );

      return res.status(200).json({
        msg: "success",
        ans: result
      });

    } catch (e: any) {
      return res.status(500).json({
        msg: e.message,
        ans: []
      });
    }
  }
  static async ArbitratorGetAll(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;

      const arbitrator_id = (req as AuthRequest).userContext?.entity_id;

      if(!arbitrator_id) return res.status(401).json({ msg: "Unauthorized, login first", ans: [] });

      const result = await disputesService.arbitratorAll(
        limit,
        offset,
        arbitrator_id as string
      );

      return res.status(200).json({
        msg: "success",
        ans: result
      });

    } catch (e: any) {
      return res.status(500).json({
        msg: e.message,
        ans: []
      });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          msg: "Missing dispute id",
          ans: null
        });
      }

      const actor = (req as AuthRequest).userContext?.entity_id;
      if(!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

      const result = await disputesService.softDelete(id as string,actor as string);

      return res.status(200).json({
        msg: "success",
        ans: result
      });

    } catch (e: any) {
      return res.status(500).json({
        msg: e.message,
        ans: null
      });
    }
  }
}
