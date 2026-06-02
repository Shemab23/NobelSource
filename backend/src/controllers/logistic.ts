import { type Response, type Request } from "express";
import type { AuthRequest } from "../types/request";
import { LogisticsService } from "../services/logistic";
import { ItemsService } from "../services/items";
import type { Logistics,Transport,Payment } from "../dataBase/schema";
import { CloudinaryService } from "../services/cloudnary";

const service = new LogisticsService();
const itemsService = new ItemsService();


export class LogisticsController {

  /**
   * INITIALIZE SHIPMENT CONTRACT
   */
  static async create(req: AuthRequest, res: Response) {
    const actor = req.userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });

    const focus = req.params.focus;
    if (focus !== "to" && focus !== "from") {
      return res.status(400).json({ msg: "Missing focus field" });
    }

    const { item_id,transport_metadata, payment, room_id } = req.body;

    let from_id:string;
    let to_id:string;

    if (focus === "to") {
      from_id = actor;
      to_id = req.body.from_id;
    } else if (focus === "from") {
      from_id = req.body.to_id;
      to_id = actor;
    }else{
      return res.status(400).json({ msg: "Missing focus field" });
    }

    const result = await service.startShipment({
      item_id,
      from_id,
      to_id,
      room_id,
      transport_metadata,
      payment
    }, actor);

    if (result.msg === "shipment_exists") {
      return res.status(409).json(result);
    }

    return res.status(result.ans ? 201 : 400).json(result);
  }

  /**
   * READ INDIVIDUAL RECORD LOGS BY PRIMARY KEY
   */
  static async getOne(req: Request, res: Response) {
    const actor = (req as any).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });

    const id = req.params.id as string;
    if(!id) return res.status(400).json({ msg: "Missing id field" });

    const result = await service.getById(id as string,actor);

    if (result.msg === "not_found") {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  }

  /**
   * EXTRACT LOGISTICS INSTANCES ASSOCIATED WITH AN ITEM
   */
  static async getByItem(req: Request, res: Response) {
    const actor = (req as any).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });

    const id = req.params.item_id as string;
    if(!id) return res.status(400).json({ msg: "Missing id field" });

    const result = await service.getByItem(id  as string,actor);

    if (result.msg === "not_found") {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  }

  /**
   * EXTRACT ALL LOGISTICS & VISIBILITY TIMELINES IN A ROOM
   */
  static async getAllroomlogistics(req: Request, res: Response) {
    const { roomId } = req.params;

    const actor = (req as any).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });

    const itemsResponse = await itemsService.listRoomItems(roomId  as string,actor);
    const itemRecords = itemsResponse?.ans || [];

    const result = [];

    for (const item of itemRecords) {
      const r = await service.getByItem(item.id,actor);

      if (r.msg === "not_found") continue;

      result.push({
        item,
        logistics: r.ans
      });
    }

    return res.status(200).json({ msg: "success", ans: result });
  }

  /**
   * TRANSITION TRANSIT VISIBILITY STATES
   */
  static async updateStatus(req: AuthRequest, res: Response) {
    const actor = req.userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });

    const id = req.params.id  as string;
    if(!id) return res.status(400).json({ msg: "Missing id field" });
    const { status, note } = req.body as Pick<Logistics, "status"> & { note?: string };

    if (!status) {
      return res.status(400).json({ msg: "Missing status field" })
    }


    const result = await service.updateStatus(
      id,
      actor,
      status,
      note??""
    );

    if (result.msg === "not_found") return res.status(404).json(result);
    if (result.msg === "forbidden") return res.status(403).json(result);
    if (result.msg === "failed_to_update") return res.status(400).json(result);

    return res.status(200).json(result);
  }

  /**
   * PROCESS PAYMENT RELEASE
   */
    static async processPaymentRelease(req: AuthRequest, res: Response) {
    try {
      const actor = req.userContext?.entity_id;
      if (!actor) {
        return res.status(401).json({ msg: "Unauthorized", ans: null });
      }

      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({ msg: "Missing id parameter field", ans: null });
      }

      const { amount, rate } = req.body;
      if (!amount) {
        return res.status(400).json({ msg: "Missing amount field from payload request", ans: null });
      }

      if (!rate) {
        return res.status(400).json({ msg: "Missing rate field from payload request", ans: null });
      }

      const parsedAmount = Number(amount);
      const parsedRate = Number(rate);

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ msg: "Amount field parameter must be a valid positive number", ans: null });
      }

      if (isNaN(parsedRate) || parsedRate <= 0 || parsedRate > 5) {
        return res.status(400).json({ msg: "Rate field parameter must be a valid positive number from 0 till 5, included", ans: null });
      }

      const proofFile = req.file;
      let proofUrl: string | undefined;

      if (proofFile) {
        const uploadedProof = await CloudinaryService.uploadBuffer(
          proofFile.buffer,
          "logistics/proofs"
        );
        proofUrl = uploadedProof.url;
      }

      const result = await service.processPaymentRelease(
        id,
        actor,
        { amount: parsedAmount, proof: proofUrl },
        parsedRate
      );

      if (result.msg === "not_found") {
        return res.status(404).json({ msg: "Logistics record not found", ans: null });
      }
      if (result.msg === "forbidden") {
        return res.status(403).json({ msg: "Action forbidden for this account context", ans: null });
      }
      if (result.msg === "failed_to_update") {
        return res.status(400).json({ msg: "Unable to update logistics payment state data", ans: null });
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message || "Internal server error occurred", ans: null });
    }
  }

  static async confirmPaymentRelease(req: AuthRequest, res: Response) {
    try {
      const actor = req.userContext?.entity_id;
      if (!actor) {
        return res.status(401).json({ msg: "Unauthorized", ans: null });
      }

      const rate = req.body.rate;
      if (!rate) {
        return res.status(400).json({ msg: "Missing rate field from payload request", ans: null });
      }
      const parsedRate = Number(rate);
      if (isNaN(parsedRate) || parsedRate <= 0 || parsedRate > 5) {
        return res.status(400).json({ msg: "Rate field parameter must be a valid positive number from 0 till 5, included", ans: null });
      }

      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({ msg: "Missing id parameter field", ans: null });
      }

      // Safe, clean variable forwarding
      const result = await service.confirmPaymentRelease(id, actor, parsedRate);

      if (result.msg === "not_found") {
        return res.status(404).json({ msg: "Logistics record not found", ans: null });
      }
      if (result.msg === "forbidden") {
        return res.status(403).json({ msg: "Action forbidden for this participant account", ans: null });
      }
      if (result.msg === "failed_to_update") {
        return res.status(400).json({ msg: "Transaction signature processing failed", ans: null });
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message || "Internal server error occurred", ans: null });
    }
  }


  /**
   * GET FULL SHIPMENT VISIBILITY PIPELINE
   */
  static async getVisibilityPipeline(req: Request, res: Response) {
    const actor = (req as any).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });
    const result = await service.getVisibilityPipeline(req.params.id  as string,actor);

    if (result.msg === "not_found") {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  }

  /**
   * CANCEL ACTIVE LOGISTICS CONTRACTS
   */
  static async cancel(req: AuthRequest, res: Response) {
    const actor = req.userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });

    const id = req.params.id  as string;
    if(!id) return res.status(400).json({ msg: "Missing id field" });

    const result = await service.cancel(
      id,
      actor
    );

    if (result.msg === "not_found") return res.status(404).json(result);
    if (result.msg === "forbidden") return res.status(403).json(result);

    return res.status(200).json(result);
  }

  /**
   * ADMIN GLOBAL LIST
   */
  static async getAll(req: Request, res: Response) {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const actor = (req as any).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });

    const result = await service.GetAll(limit, offset,actor);

    return res.status(200).json(result);
  }
}
