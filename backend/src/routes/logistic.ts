import { Router } from "express";
import { authGuard } from "../middlewares/auth";
import { LogisticsController } from "../controllers/logistic";
import { upload } from "../middlewares/upload";
import { adminGuard } from "../middlewares/admin";

const router = Router();

router.post("/:focus", authGuard, LogisticsController.create); // to | from

router.get("/", authGuard, LogisticsController.getAll);

router.get("/:id", authGuard, LogisticsController.getOne);

router.get("/item/:item_id", authGuard, LogisticsController.getByItem);

router.get("/room/:roomId", authGuard, LogisticsController.getAllroomlogistics);

router.get("/:id/pipeline", authGuard, LogisticsController.getVisibilityPipeline);// track the whole process ?? depend on wat we log, : currently target shipment

router.patch("/:id/status", authGuard, LogisticsController.updateStatus);


router.patch("/:id/payment-release", authGuard, upload.single("proof"), LogisticsController.processPaymentRelease);

router.patch("/:id/payment-confirm", authGuard, LogisticsController.confirmPaymentRelease);


router.delete("/:id", authGuard,adminGuard, LogisticsController.cancel);

export default router;
