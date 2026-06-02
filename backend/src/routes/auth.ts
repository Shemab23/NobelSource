import { Router } from "express";

import { AuthController } from "../controllers/auth";

import { authGuard } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const router = Router();



router.post(
  "/register",
  upload.fields([
    { name: "display_image", maxCount: 1 },
    { name: "permissions", maxCount: 20 }
  ]),
  AuthController.register
);


router.post(
  "/login",
  AuthController.login
);


router.use(authGuard);

router.post(
  "/logout",
  AuthController.logout
);

export default router;

