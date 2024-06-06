import { Router } from "express";
import { getFollowersCount, getUserDashboardDetails, getUserFollowData } from "../controllers/dashboard.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/user", verifyJwt, getUserDashboardDetails);
router.get("/user/:userId/:interval", verifyJwt, getUserFollowData);
router.get("/user/followers/count/:userId", verifyJwt, getFollowersCount);

export default router;
