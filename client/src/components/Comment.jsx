import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useState } from "react";

const Comment = () => {
  const [liked, setLiked] = useState();
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={"hi"} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex flexDirection={"column"}>
            <Text fontSize="sm" fontWeight="bold">
              {"elonmusk"}
            </Text>
            <Text>{"This is reply"}</Text>
            <Actions liked={liked} setLiked={setLiked} />
            <Text color={"gray.light"}>1 Like</Text>
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
