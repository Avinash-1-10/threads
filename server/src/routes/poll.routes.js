import express from "express";
import { castVote, checkVoted, createPoll, deletePoll, getAllPolls, getPollById } from "../controllers/poll.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", verifyJwt, createPoll);
router.get("/", getAllPolls);
router.get("/:id", getPollById)
router.post("/vote", verifyJwt, castVote);
router.get("/check-vote/:pollId", verifyJwt, checkVoted);
router.delete("/:id", verifyJwt, deletePoll);

export default router;