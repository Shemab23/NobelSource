import { type Request, type Response } from "express";
import { EntityService } from "../services/entities";
import type { Entity } from "../dataBase/schema";

const entityService = new EntityService();

export class EntityController {


  static async createEntity(req: Request, res: Response) {
  try {
    const { type } = req.body as { type: "user" | "room" };

    if (!type) {
      return res.status(400).json({ msg: "Missing type", ans: null });
    }

    const actor = (req as any).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

    const result = await entityService.createEntity(type, actor);


    return res.status(result.ans ? 201 : 400).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}

  static async getEntity(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Missing ID", ans: null });
    }

    const actor = (req as any).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

    const result = await entityService.getEntityById(id as string,actor);

    return res.status(200).json({ msg: "success", ans: result });
  } catch (e: any) {
    return res.status(404).json({ msg: e.message, ans: null });
  }
}


  static async exists(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Missing ID", ans: false });
    }

    const actor = (req as any).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

    await entityService.getEntityById(id as string,actor);

    return res.status(200).json({ msg: "success", ans: true });
  } catch {
    return res.status(200).json({ msg: "not found", ans: false });
  }
}

  static async checkType(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { type } = req.query;

    if (!id || !type) {
      return res.status(400).json({ msg: "Missing ID or type", ans: false });
    }
    const actor = (req as any).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

    const entity = await entityService.getEntityById(id as string,actor);

    const ok = entity?.type === type;

    return res.status(200).json({
      msg: ok ? "success" : "type mismatch",
      ans: ok
    });
  } catch (e: any) {
    return res.status(404).json({ msg: e.message, ans: false });
  }
}

  // Admin Operations Extensions


  static async getAllEntities(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const actor = (req as any).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

    const result = await entityService.GetAll(limit, offset,actor);

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: [] });
  }
}


  static async updateEntity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { type } = req.body as { type: "user" | "room" };

      if (!id || !type) {
        return res.status(400).json({ msg: "Missing id or type", ans: null });
      }
      const actor = (req as any).userContext?.entity_id;
      if(!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

      const result = await entityService.updateEntity(id as string, type,actor);

      return res.status(result.ans ? 200 : 400).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }


  static async deleteEntity(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Missing ID", ans: null });
    }

    const actor = (req as any).userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized", ans: null });

    const result = await entityService.deleteEntity(id as string,actor);

    return res.status(result.ans ? 200 : 400).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}
}
