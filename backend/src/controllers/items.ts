import { type Response, type Request } from "express";
import { ItemsService } from "../services/items";
import { type AuthRequest } from "../types/request";
import { RoomMembersService } from "../services/room_member";
import type { Item,ItemAnalytics } from "../dataBase/schema";

const roomMember = new RoomMembersService();

const itemsService = new ItemsService();

export class ItemsController {

  /**
   * INITIALIZE NEW INVENTORY ITEM
   */
  static async createItem(req: AuthRequest, res: Response) {
  if (!req.userContext) {
    return res.status(401).json({ msg: "Unauthorized" });
  }


  const { room_id, amount, name} = req.body;

  let sender: string;
  let receiver: string;

  const focus = req.params.focus;

  if(! focus) return res.status(400).json({ msg: "Missing focus field" });

  const me = req.userContext.entity_id;

  if(!me) return res.status(400).json({ msg: "Unauthorized , need to first login" });

  if (focus === "send") {
    sender = me;
    receiver = req.body.receiver;
  } else if (focus === "receive"){
    sender = req.body.sender;
    receiver = me;
  }
  else{
    return res.status(400).json({ msg: "focus field can only be send or receive" });
  }

  const [meInRoom, OtherinRoom] = await Promise.all([
    roomMember.isMember(room_id as string, me),
    roomMember.isMember(room_id as string, receiver)
  ]);

  if (!meInRoom.ans || !OtherinRoom.ans) {
    return res.status(400).json({ msg: "sender and receiver should be in the same room!!" });
  }

  const actor = me;

  if (!room_id || amount === undefined) {
    return res.status(400).json({ msg: "Missing fields" });
  }

  const result = await itemsService.createItem(
    room_id,
    Number(amount),
    name,
    sender,
    receiver,
    actor
  );

  return res.json(result);
}

  /**
   * READ INDIVIDUAL INVENTORY RECORD BY ID
   */
  static async getItem(req: AuthRequest, res: Response) {
    const actor = req.userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });

  const result = await itemsService.getItemById(req.params.id as string, actor);

  return res.status(result.msg === "success" ? 200 : 404).json(result);
}

  /**
   * FETCH ALL RECORDS ASSOCIATED WITH A ROOM
   */
  static async listRoomItems(req: AuthRequest, res: Response) {
    const { room_id } = req.params;

    const actor = req.userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });

    const result = await itemsService.listRoomItems(room_id as string,actor);

    return res.status(200).json(result);
  }

  /**
   * UPDATE STOCK QUANTITY COUNTS
   */
  static async updateItemAmount(req: AuthRequest, res: Response) {
    const actor = req.userContext?.entity_id;
    if(!actor) return res.status(401).json({ msg: "Unauthorized" });


  const { id } = req.params;
  const { amount } = req.body;

  if (amount === undefined) {
    return res.status(400).json({ msg: "Missing amount value field" });
  }

  const result = await itemsService.updateItemAmount(id as string, Number(amount),actor);

  return res.status(result.msg === "success" ? 200 : 404).json(result);
}

  /**
   * PERMANENT HARD ERASE OF AN ITEM ASSET RECORD
   */
  static async deleteItem(req: AuthRequest, res: Response) {
    try {
      const actor = req.userContext?.entity_id;
      if(!actor) return res.status(401).json({ msg: "Unauthorized" });

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ msg: "Missing item id" });
      }

      const result = await itemsService.deleteItem(id as string,actor);

      if (result.msg === "not found") {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ msg: e.message, ans: null });
    }
  }

  /**
   * ADMINISTRATIVE GLOBAL DASHBOARD INDEX
   */
  static async getAll(req: Request, res: Response) {
  const limit = Number(req.query.limit) || 10;
  const offset = Number(req.query.offset) || 0;

  const result = await itemsService.getAll(limit, offset);
  return res.status(200).json(result);
}
}
