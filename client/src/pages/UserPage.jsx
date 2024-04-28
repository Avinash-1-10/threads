import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import posts from "../data/posts";
import { useParams } from "react-router-dom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import { Text } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { username } = useParams();
  const showToast = useShowToast();
  const geUser = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/user/profile/${username}`);
      setUser(data.data);
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    }finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    geUser();
  }, [username]);
  return (
    <>
      {loading ? (
        <Text fontSize={"3xl"} fontWeight={"bold"} textAlign={"center"} mt={10}>
          Loading...
        </Text>
      ) : (
        <>
          <UserHeader user={user} />
          {posts.map((post, index) => (
            <UserPost
              key={index}
              likes={post.likes}
              replies={post.replies}
              postImg={post.postImg}
              postTitle={post.postTitle}
            />
          ))}
        </>
      )}
    </>
  );
};

export default UserPage;
