import { Router } from "express";
import { RoomMemberController } from "../controllers/room_member";
import { authGuard } from "../middlewares/auth";

const router = Router();

router.get("/member/in", (req, res) => {
  res.json({ msg: "in room member api" });
});

router.use(authGuard);

router.get("/all", RoomMemberController.getAllMembersPagination); // put adminguard

router.post("/:id/join", RoomMemberController.joinRoom);

router.get("/:id", RoomMemberController.RoomMembers);

router.delete("/:id/members", RoomMemberController.removeMember);


export default router;
