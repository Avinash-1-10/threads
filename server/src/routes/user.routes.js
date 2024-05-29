import { Router } from "express";
import {
  changePassword,
  getUserProfile,
  getUsers,
  login,
  logout,
  signup,
  updateUser,
} from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile/:query", getUserProfile);
router.put("/update", verifyJwt, upload.single("avatar"), updateUser);
router.get("/search", getUsers);
router.put("/change-password", verifyJwt, changePassword);

export default router;
