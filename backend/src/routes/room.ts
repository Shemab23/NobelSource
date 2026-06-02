import { Router } from "express";
import { RoomsController } from "../controllers/room";
import { authGuard } from "../middlewares/auth";
import { adminGuard } from "../middlewares/admin";

const router = Router();

router.use(authGuard);

// create
router.post("/", RoomsController.createRoom);

// my rooms
router.get("/mine", RoomsController.getMyRooms);


router.get("/:id", RoomsController.getRoomById);

// room ops
router.patch("/:id", RoomsController.updateRoom);
router.patch("/:id/soft-delete", RoomsController.softDeleteRoom);

// room data
router.get("/:id/financials", RoomsController.getFinancials);
router.get("/:id/items", RoomsController.getItems);


// router.use(adminGuard);

router.get("/all", RoomsController.getAll);

export default router;
