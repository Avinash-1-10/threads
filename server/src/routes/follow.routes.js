import { Router } from "express";
import { checkFollowing, follow, getFollowers, getFollowing } from "../controllers/follow.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:id", verifyJwt, follow)
router.get("/follwers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);
router.get("/check/following/:userId", verifyJwt, checkFollowing)


export default router;