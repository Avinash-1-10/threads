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
  const [comments, setComments] = useState([]);
  const [reload, setReload] = useState(false);
  const showToast = useShowToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: postData } = await axios.get(`/api/v1/post/${pid}`);
        setPost(postData.post);
        if (postData.post?._id) {
          const { data: likeData } = await axios.get(
            `/api/v1/like/count/post/${postData.post._id}`
          );
          const { data: comments } = await axios.get(
            `/api/v1/comment/post/${postData.post._id}`
          );
          setComments(comments.data);
          setLikeCount(likeData.data.likeCount);
          setIsLiked(likeData.data.isLiked);
        }
      } catch (error) {
        showToast(
          "Error",
          error.response?.data.message || error.message,
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pid, reload]);

  return (
    <>
      <Flex alignItems={"center"} gap={3}>
        <Avatar
          src={post?.postBy?.avatar}
          size={"md"}
          name={post?.postBy?.username || "User"}
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

      <Text my={3}>{post.text}</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={post.image} w={"full"} />
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
          {likeCount} likes
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
      {comments.map((comment, i) => (
        <Comment comment={comment}  key={i}/>
      ))}
    </>
  );
};

export default PostPage;
