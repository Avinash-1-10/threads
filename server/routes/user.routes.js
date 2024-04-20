import { Router } from "express";
import { getUserProfile, login, logout, signup, updateUser } from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile/:query", getUserProfile)
router.post("/update", verifyJwt, updateUser);


export default router;
