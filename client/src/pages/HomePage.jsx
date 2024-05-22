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

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const refresh = useRecoilValue(refreshAtom);
  const getPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v1/feed");
      setPosts(data.data);
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
          <Poll/>
          {posts.map((post) =>
            post.type === "post" ? (
              <UserPost key={post._id} post={post} user={post.postByDetails} />
            ) : (
              <Repost
                key={post._id}
                repost={post}
                user={post.repostByDetails}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default HomePage;
