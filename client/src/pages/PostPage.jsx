import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import { useParams } from "react-router-dom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";

const PostPage = () => {
  const { pid } = useParams();
  const [post, setPost] = useState({});
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const showToast = useShowToast();


  const getPost = async () => {
    try {
      const { data } = await axios.get(`/api/v1/post/${pid}`);
      setPost(data.post)
    } catch (error) {
      showToast("Error", error.response.data.message || error.message, "error");
    }
  };

  const getLikeCount = async () => {
    try {
      const { data } = await axios.get(`/api/v1/like/count/post/${post._id}`);
      console.log(data)
      setLikeCount(data.data.likeCount);
      setIsLiked(data.data.isLiked);
    } catch (error) {
      console.log(error.response.data.message)
      showToast("Error", error.response.data.message || error.message, "error");
    }
  };
  useEffect(() => {
    getPost();
    getLikeCount()
  }, [reload]);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={post?.postBy?.avatar}
            size={"md"}
            name="Elon"
          />
          <Flex alignItems={"center"} gap={2}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {post?.postBy?.username}
            </Text>
            <MdVerified color="#2B96E9" />
          </Flex>
          <Flex gap={4} alignItems={"center"} ml={"auto"}>
            <Text fontSize={"sm"} color={"gray.light"}>
              1d
            </Text>
            <BsThreeDots />
          </Flex>
        </Flex>
      </Flex>
      <Text my={3}>{post.text}</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image
          src={post.image}
          w={"full"}
        />
      </Box>
      <Flex gap={3} my={3}>
        <Actions isLiked={isLiked} post={post} setReload={setReload} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          123 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {0} likes
        </Text>
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
    </>
  );
};

export default PostPage;
