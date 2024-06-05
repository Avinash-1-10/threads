import Follow from "../models/follow.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getUserDashboardDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -createdAt -updatedAt -__v"
    );

    // get all posts count for user
    const postCount = await Post.countDocuments({ postBy: req.user._id });

    // get followers count for user
    const followersCount = await Follow.countDocuments({
      following: req.user._id,
    });

    // get following count for user
    const followingCount = await Follow.countDocuments({
      follower: req.user._id,
    });

    return res.status(200).json(
      new ApiResponse(200, "User dashboard details fetched successfully", {
        user,
        postCount,
        followersCount,
        followingCount,
      })
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

const getDateFilter = (interval) => {
  const currentDate = new Date();
  switch (interval) {
    case "daily":
      currentDate.setDate(currentDate.getDate() - 7);
      break;
    case "weekly":
      currentDate.setDate(currentDate.getDate() - 28);
      break;
    case "monthly":
      currentDate.setMonth(currentDate.getMonth() - 6);
      break;
    case "yearly":
      currentDate.setFullYear(currentDate.getFullYear() - 5);
      break;
    default:
      currentDate.setDate(currentDate.getDate() - 7);
      break;
  }
  return currentDate;
};

const getDataByInterval = async (userId, interval) => {
  const dateFilter = getDateFilter(interval);
  const matchStage = {
    $match: {
      $or: [
        { follower: new mongoose.Types.ObjectId(userId) },
        { following: new mongoose.Types.ObjectId(userId) },
      ],
      createdAt: { $gte: dateFilter },
    },
  };
  const projectStage = {
    $project: {
      day: { $dayOfWeek: "$createdAt" },
      week: { $week: "$createdAt" },
      month: { $month: "$createdAt" },
      year: { $year: "$createdAt" },
      follower: 1,
      following: 1,
    },
  };

  const groupStage = {
    daily: {
      $group: {
        _id: { day: "$day" },
        followers: {
          $sum: {
            $cond: [
              { $eq: ["$follower", new mongoose.Types.ObjectId(userId)] },
              1,
              0,
            ],
          },
        },
        following: {
          $sum: {
            $cond: [
              { $eq: ["$following", new mongoose.Types.ObjectId(userId)] },
              1,
              0,
            ],
          },
        },
      },
    },
    weekly: {
      $group: {
        _id: { week: "$week" },
        followers: {
          $sum: {
            $cond: [
              { $eq: ["$follower", new mongoose.Types.ObjectId(userId)] },
              1,
              0,
            ],
          },
        },
        following: {
          $sum: {
            $cond: [
              { $eq: ["$following", new mongoose.Types.ObjectId(userId)] },
              1,
              0,
            ],
          },
        },
      },
    },
    monthly: {
      $group: {
        _id: { month: "$month" },
        followers: {
          $sum: {
            $cond: [
              { $eq: ["$follower", new mongoose.Types.ObjectId(userId)] },
              1,
              0,
            ],
          },
        },
        following: {
          $sum: {
            $cond: [
              { $eq: ["$following", new mongoose.Types.ObjectId(userId)] },
              1,
              0,
            ],
          },
        },
      },
    },
    yearly: {
      $group: {
        _id: { year: "$year" },
        followers: {
          $sum: {
            $cond: [
              { $eq: ["$follower", new mongoose.Types.ObjectId(userId)] },
              1,
              0,
            ],
          },
        },
        following: {
          $sum: {
            $cond: [
              { $eq: ["$following", new mongoose.Types.ObjectId(userId)] },
              1,
              0,
            ],
          },
        },
      },
    },
  };

  const sortStage = {
    $sort: {
      "_id.day": 1,
      "_id.week": 1,
      "_id.month": 1,
      "_id.year": 1,
    },
  };

  const aggregationPipeline = [
    matchStage,
    projectStage,
    groupStage[interval],
    sortStage,
  ];

  const result = await Follow.aggregate(aggregationPipeline);
  return result;
};

const formatData = (interval, result) => {
  const labels = {
    daily: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekly: ["Week 1", "Week 2", "Week 3", "Week 4"],
    monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    yearly: ["2018", "2019", "2020", "2021", "2022", "2023"],
  };

  const data = {
    followers: new Array(labels[interval].length).fill(0),
    following: new Array(labels[interval].length).fill(0),
  };

  result.forEach((item) => {
    if (interval === "daily") {
      data.followers[item._id.day - 1] = item.followers;
      data.following[item._id.day - 1] = item.following;
    } else if (interval === "weekly") {
      data.followers[item._id.week % 4] = item.followers;
      data.following[item._id.week % 4] = item.following;
    } else if (interval === "monthly") {
      data.followers[item._id.month - 1] = item.followers;
      data.following[item._id.month - 1] = item.following;
    } else if (interval === "yearly") {
      const yearIndex = labels[interval].indexOf(item._id.year.toString());
      if (yearIndex !== -1) {
        data.followers[yearIndex] = item.followers;
        data.following[yearIndex] = item.following;
      }
    }
  });

  return {
    labels: labels[interval],
    data,
  };
};

export const getUserFollowData = async (req, res) => {
  const { userId, interval } = req.params;

  try {
    const result = await getDataByInterval(userId, interval);
    const formattedData = formatData(interval, result);
    res.json(formattedData);
  } catch (error) {
    res.status(500).json(new ApiError(500, error.message));
  }
};

export { getUserDashboardDetails };
