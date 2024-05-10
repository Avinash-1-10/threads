import React, { useEffect, useState } from "react";
import UserPost from "../components/UserPost";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import { Stack } from "@chakra-ui/react";
import UserPostSkeleton from "../skeletons/UserPostSkeleton";

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const getPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v1/post");
      setPosts(data.data);
    } catch (error) {
      showToast("Error", error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      {loading ? (
        <Stack>
          {[1, 2, 3].map((i) => (
            <UserPostSkeleton key={i} />
          ))}
        </Stack>
      ) : (
        <div>
          {posts.map((post) => (
            <UserPost key={post._id} post={post} user={post.postByDetails} />
          ))}
        </div>
      )}
    </>
  );
};

export default HomePage;
