import { Router } from "express";
import { adminGuard } from "../middlewares/admin";
import { AuditController } from "../controllers/audit";
import type { AuditLog } from "../dataBase/schema";

const router = Router();


router.use(adminGuard);

router.get(
  "/",
  AuditController.getGlobalLogs
);


router.get(
  "/log/:id",
  AuditController.getByAuditId
);


router.get(
  "/entity/:id",
  AuditController.getByEntity
);


router.get(
  "/room/:roomId",
  AuditController.roomAudit
);


router.get(
  "/since",
  AuditController.getSince
);

export default router;
