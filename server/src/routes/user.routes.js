import { Router } from "express";
import {
  changePassword,
  getUserProfile,
  getUsers,
  login,
  logout,
  resetPassword,
  sendPasswordResetEmail,
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
router.post("/forgot-password", sendPasswordResetEmail);
router.post("/reset-password", resetPassword);

export default router;
