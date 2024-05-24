import Option from "../models/options.model.js";
import Poll from "../models/poll.model.js";
import Vote from "../models/vote.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find({}).populate("options").lean();

    // Loop through each poll and populate votes with vote count
    for (const poll of polls) {
      const votes = await Vote.find({ poll: poll._id });

      // Transform options with vote count
      poll.options = poll.options.map((option) => ({
        ...option,
        voteCount: votes.filter(
          (vote) => vote.option.toString() === option._id.toString()
        ).length,
      }));

      // Calculate total votes for the poll
      poll.totalVotes = votes.length;
    }

    res.json(polls);
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question) {
      return res.status(400).json(new ApiError(400, "Question is required"));
    }

    // Validate options count
    if (!options || options.length < 2 || options.length > 5) {
      return res
        .status(400)
        .json(new ApiError(400, "Options must be between 2 and 5"));
    }

    // Create option documents
    const optionDocs = await Option.insertMany(
      options.map((optionText) => ({ text: optionText }))
    );

    // Create the poll document
    const poll = new Poll({
      question,
      options: optionDocs,
      createdBy: req.user._id,
    });

    // Save the poll
    await poll.save();

    res
      .status(201)
      .json(new ApiResponse(201, "Poll created successfully", poll));
  } catch (error) {
    res.status(500).json(new ApiError(500, error.message));
  }
};

const castVote = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;

    // Check if the poll exists
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json(new ApiError(404, "Poll not found"));
    }

    // Check if the option belongs to the poll
    const option = await Option.findById(optionId);
    if (!option || !poll.options.some((opt) => opt.equals(option._id))) {
      return res.status(400).json(new ApiError(400, "Invalid option"));
    }

    // Check if the user has already voted on this poll
    const existingVote = await Vote.findOne({
      poll: pollId,
      user: req.user._id,
    });
    if (existingVote) {
      return res
        .status(400)
        .json(new ApiError(400, "You have already voted on this poll"));
    }

    // Create and save the vote
    const vote = new Vote({
      poll: pollId,
      option: optionId,
      user: req.user._id,
    });

    await vote.save();

    res.status(201).json(new ApiResponse(201, "Vote casted successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, error.message));
  }
};

const checkVoted = async (req, res, next) => {
  const { pollId } = req.params;

  const hasVoted = await Vote.findOne({
    poll: pollId,
    user: req.user._id,
  });

  if (hasVoted) {
    return res
      .status(200)
      .json(new ApiResponse(200, "You have already voted on this poll", true));
  }
  return res.status(200).json(new ApiResponse(200, "Not voted yet", false));
};

export { getAllPolls, createPoll, castVote, checkVoted };
