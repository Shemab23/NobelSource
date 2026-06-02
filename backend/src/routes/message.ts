import { Router } from "express";
import { MessageController } from "../controllers/message";
import { authGuard } from "../middlewares/auth";
import { adminGuard } from "../middlewares/admin";

const router = Router();

router.get("/in", (req, res) => {
  res.json({ msg: "in message api" });
});

router.post("/", authGuard, MessageController.sendMessage);

router.patch("/:id/respond", authGuard, MessageController.respondToMessage);


router.get("/mymessages", authGuard, MessageController.MyMessages);

router.get("/admin/all", authGuard,adminGuard, MessageController.getAllMessages);

router.get("/conversation/:id", authGuard, MessageController.getConversation);

router.get("/:roomId/room", authGuard, MessageController.MessagesInRoom);

router.delete("/:id", authGuard,adminGuard, MessageController.deleteMessage);

export default router;
