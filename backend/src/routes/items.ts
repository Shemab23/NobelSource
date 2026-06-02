import { Router } from "express";
import { ItemsController } from "../controllers/items";
import { authGuard } from "../middlewares/auth";

const router = Router();

router.get("/", authGuard, ItemsController.getAll);

router.post("/:focus", authGuard, ItemsController.createItem); // send | receive

router.get("/room/:room_id", authGuard, ItemsController.listRoomItems);

router.get("/:id", authGuard, ItemsController.getItem);

router.patch("/:id/amount", authGuard, ItemsController.updateItemAmount);

router.delete("/:id", authGuard, ItemsController.deleteItem);

export default router;
