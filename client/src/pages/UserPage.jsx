import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import { Stack, Text } from "@chakra-ui/react";
import UserPostSkeleton from "../skeletons/UserPostSkeleton";
import Repost from "../components/Repost";
import Poll from "../components/poll";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const { username } = useParams();
  const showToast = useShowToast();

  const getUser = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://threads-ffw7.onrender.com/api/v1/user/profile/${username}`);
      setUser(data.data);
    } catch (error) {
      showToast("Error", error.response?.data?.message || "Failed to load user data", "error");
    } finally {
      setLoading(false);
    }
  };

  const getPosts = async () => {
    setPostsLoading(true);
    try {
      const { data } = await axios.get(`https://threads-ffw7.onrender.com/api/v1/feed/${username}`);
      setPosts(data.data);
      // console.log(data.data)
    } catch (error) {
      showToast("Error", error.response?.data?.message || error.message);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    getPosts();
  }, [username]);

  return (
    <>
      {loading ? (
        <Text fontSize={"3xl"} fontWeight={"bold"} textAlign={"center"} mt={10}>
          Loading User...
        </Text>
      ) : (
        <UserHeader user={user} />
      )}
      {postsLoading ? (
        <Stack>
          {[...Array(10).keys()].map((item) => (
            <UserPostSkeleton key={item} />
          ))}
        </Stack>
      ) : (
        <div>
          {posts.map((post) => {
            if (post.type === "post") {
              return <UserPost key={post._id} post={post} user={post.postByDetails} />;
            } else if (post.type === "repost") {
              return (
                <Repost key={post._id} repost={post} user={post.repostByDetails} />
              );
            } else if (post.type === "poll") {
              return <Poll key={post._id} pollData={post} />; 
            } else {
              console.warn("Unknown post type:", post.type);
              return null;
            }
          })}
        </div>
      )}
    </>
  );
};

export default UserPage;
