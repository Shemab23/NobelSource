import { Router } from "express";
import { UserController } from "../controllers/user";
import { authGuard } from "../middlewares/auth";
import { adminGuard } from "../middlewares/admin";
import { upload } from "../middlewares/upload";

const router = Router();


router.get("/in", (req, res) => {
  res.json({ msg: "welcome to user API" });
});

router.get("/me", UserController.me);

router.get("/:id", UserController.getUser);

router.use(authGuard);

router.get("/", UserController.listUsers);


// UPDATE SELF USER
router.patch("/profile/update",UserController.updateMyProfile);


router.put(
  "/profile/image",
  authGuard,
  upload.single("image"),
  UserController.updateUserImage
);


router.patch(
  "/:id/role",
  adminGuard,
  UserController.updateRole
);

router.delete("/:id", UserController.deleteUser);

export default router;
