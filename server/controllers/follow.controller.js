import Follow from "../models/follow.model.js";

const follow = async (req, res) => {
  try {
    const following = req.params.id;
    const follower = req.user._id;
    if(following === follower){
        return res.status(400).json({message:"You cant follow yourself"});
    }
    const followedAcc = await Follow.findOne({ follower, following });
    if (followedAcc) {
      await Follow.findOneAndDelete({ _id: followedAcc._id });
      return res.status(200).json({ message: "Unfollowed successfully" });
    }
    const newFollow = new Follow({
      follower,
      following,
    });
    await newFollow.save();
    return res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error in follow controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find all follows where the following field matches the userId
    const followers = await Follow.find({ following: userId }).populate(
      "follower"
    );
    if (!followers) {
      return res.status(404).json({ message: "Followers not found" });
    }

    return res.status(200).json(followers);
  } catch (error) {
    console.error("Error in getFollowers controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find all follows where the follower field matches the userId
    const following = await Follow.find({ follower: userId }).populate(
      "following"
    );
    if (!following) {
      return res.status(404).json({ message: "Following not found" });
    }
    return res.status(200).json(following);
  } catch (error) {
    console.error("Error in getFollowing controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { follow, getFollowers, getFollowing };
