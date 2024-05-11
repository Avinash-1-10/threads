import { Avatar, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import useTimeAgo from "../hooks/useTimeAgo";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import axios from "axios";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

const Comment = (comment) => {
  const timeAgo = useTimeAgo(comment.comment.createdAt);
  const user = useRecoilValue(userAtom);
  const owner = user._id === comment.comment.commentBy._id;
  const [isCommentLiked, setCommentLiked] = useState(false);
  const [commentLikeCount, setCommentLikeCount] = useState(0);
  const [reload, setReload] = useState(false);
  const showToast = useShowToast();

  const getCommentLikes = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/comment/count/likes/${comment.comment._id}`
      );
      setCommentLikeCount(data.data.likeCount);
      setCommentLiked(data.data.liked);
    } catch (error) {}
  };

  const handleLike = async () => {
    try {
      const { data } = await axios.post(
        `/api/v1/comment/like/${comment.comment._id}`
      );
      showToast("Success", data.message, "success");
    } catch (error) {
      console.log(error);
      showToast("Error", error.response.data.message, "error");
    } finally {
      setReload(!reload);
    }
  };

  useEffect(() => {
    getCommentLikes();
  }, [reload]);
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={comment.comment.commentBy.avatar} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex flexDirection={"column"}>
            <Text>{comment.comment.commentBy.username}</Text>
            <Text color={"gray.light"}>{comment.comment.text}</Text>
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
            <RiDeleteBin5Line color="red" cursor={"pointer"} />
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
