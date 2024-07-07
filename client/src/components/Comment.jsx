import { Avatar, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import useTimeAgo from "../hooks/useTimeAgo";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import axios from "axios";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Comment = ({ comment, handleReload }) => {
  const timeAgo = useTimeAgo(comment.createdAt);
  const user = useRecoilValue(userAtom);
  const owner = user._id === comment.commentBy._id;
  const [isCommentLiked, setCommentLiked] = useState(false);
  const [commentLikeCount, setCommentLikeCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const showToast = useShowToast();

  const getCommentLikes = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/comment/count/likes/${comment._id}`
      );
      setCommentLikeCount(data.data.likeCount);
      setCommentLiked(data.data.liked);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/comment/like/${comment._id}`
      );
      showToast("Success", data.message, "success");
    } catch (error) {
      console.log(error);
      showToast("Error", error.response.data.message, "error");
    } finally {
      setRefresh(!refresh);
    }
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${BACKEND_URL}/comment/${comment._id}`
      );
      showToast("Success", data.message, "success");
      handleReload();
    } catch (error) {
      showToast(
        "Error",
        error?.response?.data?.message || error.message,
        "error"
      );
    }
  };

  useEffect(() => {
    getCommentLikes();
  }, [refresh]);

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar
          src={comment.commentBy.avatar}
          size={"sm"}
          name={comment.commentBy.name}
        />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex flexDirection={"column"}>
            <Text>{comment.commentBy.username}</Text>
            <Text color={"gray.light"}>{comment.text}</Text>
          </Flex>
        </Flex>
        <Flex
          gap={4}
          alignItems={"start"}
          justifyContent={"start"}
          ml={"auto"}
          mb={"auto"}
        >
          <Text fontSize={"sm"} color={"gray.light"}>
            {timeAgo}
          </Text>
          {owner ? (
            <RiDeleteBin5Line
              color="red"
              cursor={"pointer"}
              onClick={handleDelete}
            />
          ) : (
            <Stack alignItems={"center"}>
              {isCommentLiked ? (
                <FaHeart
                  cursor={"pointer"}
                  color="rgb(237, 73, 86)"
                  onClick={handleLike}
                />
              ) : (
                <FaRegHeart cursor={"pointer"} onClick={handleLike} />
              )}
              <Text fontSize={"sm"} color={"gray.light"}>
                {commentLikeCount}
              </Text>
            </Stack>
          )}
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;
