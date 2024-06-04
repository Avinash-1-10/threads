import { Router } from "express";
import { getUserDashboardDetails } from "../controllers/dashboard.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/user", verifyJwt, getUserDashboardDetails);

export default router;
