import { Router } from "express";
import { authGuard } from "../middlewares/auth";
import { adminGuard } from "../middlewares/admin";
import { DisputesController } from "../controllers/dispute";

const router = Router();

router.post("/", authGuard, DisputesController.raise);

router.get("/:id", authGuard, DisputesController.getOne);

router.get("/room/:room_id", authGuard, DisputesController.getRoom);

router.get("/admin/all", authGuard, adminGuard, DisputesController.getAll);

router.get("/arbitrator/all", authGuard, DisputesController.ArbitratorGetAll);

router.patch("/:id/assign", authGuard, DisputesController.assign);

router.patch("/:id/judgement", authGuard, DisputesController.judgement);

router.post("/:id/rate", authGuard, DisputesController.rate);

router.delete("/:id", authGuard, adminGuard, DisputesController.remove);

export default router;
