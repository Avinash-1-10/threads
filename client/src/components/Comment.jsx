import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useState } from "react";

const Comment = (comment) => {
  const [liked, setLiked] = useState();
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
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      <Divider />
    </>
  );
};

export default Comment;
