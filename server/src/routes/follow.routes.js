import { Router } from "express";
import { follow, getFollowers, getFollowing } from "../controllers/follow.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:id", verifyJwt, follow)
router.get("/follwers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);


export default router;