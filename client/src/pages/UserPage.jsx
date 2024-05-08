import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import { Stack, Text } from "@chakra-ui/react";
import UserPostSkeleton from "../skeletons/UserPostSkeleton";

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
      const { data } = await axios.get(`/api/v1/user/profile/${username}`);
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
      const { data } = await axios.get(`/api/v1/post/user/${username}`);
      setPosts(data.data);
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
        posts.map((post, index) => (
          <UserPost key={index} post={post} user={user} />
        ))
      )}
    </>
  );
};

export default UserPage;
