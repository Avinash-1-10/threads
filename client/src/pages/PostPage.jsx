import React, { useState } from "react";
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

const PostPage = () => {
  const [liked, setLiked] = useState();
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src="https://pbs.twimg.com/profile_images/1780044485541699584/p78MCn3B_400x400.jpg"
            size={"md"}
            name="Elon"
          />
          <Flex alignItems={"center"} gap={2}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              elonmusk
            </Text>
            <MdVerified color="#2B96E9" style={{ marginLeft: 1 }} />
          </Flex>
          <Flex gap={4} alignItems={"center"} ml={"auto"}>
            <Text fontSize={"sm"} color={"gray.light"}>
              1d
            </Text>
            <BsThreeDots />
          </Flex>
        </Flex>
      </Flex>
      <Text my={3}>This is my first post</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image
          src="https://miro.medium.com/v2/resize:fit:1360/format:webp/1*5x_Rn3QFIevucjRKI4LvMQ.png"
          w={"full"}
        />
      </Box>
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          123 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {23 + (liked ? 1 : 0)} likes
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
    </>
  );
};

export default PostPage;
