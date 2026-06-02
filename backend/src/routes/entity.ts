import { Router } from "express";
import { EntityController } from "../controllers/entity";
import { authGuard } from "../middlewares/auth";
import { adminGuard } from "../middlewares/admin";

const router = Router();

/**
 * Health / debug route
 */
router.get("/in", (req, res) => {
  res.json({ msg: "in entity api" });
});


router.use("/admin", authGuard, adminGuard);

router.post("/admin", EntityController.createEntity);
router.get("/admin/all", EntityController.getAllEntities);
router.patch("/admin/:id", EntityController.updateEntity);
router.delete("/admin/:id", EntityController.deleteEntity);

/**
 * PUBLIC READ ROUTES (more specific first)
 */
router.get("/:id/exists", EntityController.exists);
router.get("/:id/type-check", EntityController.checkType);
router.get("/:id", EntityController.getEntity);

export default router;
