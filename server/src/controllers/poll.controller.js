import Option from "../models/options.model.js";
import Poll from "../models/poll.model.js";
import Vote from "../models/vote.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if(!question) {
      return res.status(400).json(new ApiError(400, "Question is required"));
    }

    // Validate options count
    if (!options || options.length < 2 || options.length > 5) {
      return res.status(400).json(new ApiError(400, "Options must be between 2 and 5"));
    }

    // Create option documents
    const optionDocs = await Option.insertMany(options.map(optionText => ({ text: optionText })));

    // Create the poll document
    const poll = new Poll({
      question,
      options: optionDocs,
      createdBy: req.user._id,
    });

    // Save the poll
    await poll.save();

    res.status(201).json(new ApiResponse(201, "Poll created successfully", poll));
  } catch (error) {
    res.status(500).json(new ApiError(500, error.message));
  }
};




export const castVote = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;

    // Check if the poll exists
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if the option belongs to the poll
    const option = await Option.findById(optionId);
    if (!option || !poll.options.some(opt => opt.equals(option._id))) {
      return res.status(400).json({ message: 'Invalid option for this poll' });
    }

    // Check if the user has already voted on this poll
    const existingVote = await Vote.findOne({ poll: pollId, user: req.user._id });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted on this poll' });
    }

    // Create and save the vote
    const vote = new Vote({
      poll: pollId,
      option: optionId,
      user: req.user._id,
    });

    await vote.save();

    res.status(201).json({ message: 'Vote cast successfully', vote });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};



export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.aggregate([
      {
        $lookup: {
          from: 'options',
          localField: 'options',
          foreignField: '_id',
          as: 'options',
        },
      },
      {
        $addFields: {
          optionIds: '$options._id',
        },
      },
      {
        $lookup: {
          from: 'votes',
          let: { optionIds: '$optionIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$option', '$$optionIds'] },
                    { $eq: ['$poll', '$_id'] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: '$option',
                voteCount: { $sum: 1 },
              },
            },
          ],
          as: 'votes',
        },
      },
      {
        $addFields: {
          totalVotes: { $sum: '$votes.voteCount' },
        },
      },
    ]);

    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
