import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import useTimeAgo from "../hooks/useTimeAgo";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const Comment = (comment) => {
  const timeAgo = useTimeAgo(comment.comment.createdAt);
  const user = useRecoilValue(userAtom);
  const owner = user._id === comment.comment.commentBy._id;
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
        <Flex gap={4} alignItems={"center"} ml={"auto"} mb={"auto"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            {timeAgo}
          </Text>
          {owner ? <RiDeleteBin5Line color="red" cursor={"pointer"} />: <FaRegHeart/>}
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;
