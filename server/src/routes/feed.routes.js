import express from "express";
import { getFeed, getUserFeed } from "../controllers/feed.controller.js";

const router = express.Router();

router.get("/", getFeed);
router.get("/:username", getUserFeed);


export default router;