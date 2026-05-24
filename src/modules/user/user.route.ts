import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { User_ROLE } from "../../types";

const router = Router();

router.post("/", userController.createUser);
router.get(
  "/",
  auth(User_ROLE.ADMIN, User_ROLE.AGENT),
  userController.getAllUsers,
);
router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
