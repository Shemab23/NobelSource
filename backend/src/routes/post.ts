import { Router } from "express";
import { PostController } from "../controllers/post";
import { authGuard } from "../middlewares/auth";
import { upload } from "../middlewares/upload";
import { adminGuard } from "../middlewares/admin";

const router = Router();

router.get("/in", (req, res) => {
  res.json({ msg: "in posting api" });
});

router.get("/", PostController.getGlobalFeed);
router.get("/search", PostController.searchPosts);
router.get("/active", PostController.listActivePosts);

router.get("/admin/all", authGuard,adminGuard, PostController.getGlobalFeed);

router.post(
  "/",
  authGuard,
  upload.fields([{ name: "media", maxCount: 10 }]),
  PostController.createPost
);

router.get("/:id", PostController.getPostById);

router.patch("/:id", authGuard, PostController.updatePost);
router.patch("/:id/archive", authGuard, PostController.archivePost);
router.patch("/:id/soft-delete", authGuard, PostController.softDeletePost);

router.delete("/:id", authGuard,adminGuard, PostController.deletePost);

export default router;
