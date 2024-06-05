import { Router } from "express";
import { getUserDashboardDetails, getUserFollowData } from "../controllers/dashboard.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/user", verifyJwt, getUserDashboardDetails);
router.get("/user/:userId/:interval", verifyJwt, getUserFollowData);

export default router;
