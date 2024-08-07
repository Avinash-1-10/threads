import React, { useEffect, useState } from "react";
import UserPost from "../components/UserPost";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import { Stack } from "@chakra-ui/react";
import UserPostSkeleton from "../skeletons/UserPostSkeleton";
import Repost from "../components/Repost";
import refreshAtom from "../atoms/refreshAtom";
import { useRecoilValue } from "recoil";
import Poll from "../components/poll";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const refresh = useRecoilValue(refreshAtom);

  const getPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/feed`);
      setPosts(data.data);
      // console.log(data.data)
    } catch (error) {
      showToast("Error", error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [refresh]);

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
          {posts.map((post) => {
            if (post.type === "post") {
              return (
                <UserPost
                  key={post._id}
                  post={post}
                  user={post.postByDetails}
                />
              );
            } else if (post.type === "repost") {
              return (
                <Repost
                  key={post._id}
                  repost={post}
                  user={post.repostByDetails}
                />
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

export default HomePage;
