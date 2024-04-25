import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { addComment } from "../controllers/comment.controller.js";

const router = Router();

router.post("/:id", verifyJwt, addComment)


export default router;