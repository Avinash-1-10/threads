import {
  Avatar,
  Box,
  Flex,
  Text,
  Image,
  Stack,
  Button,
} from "@chakra-ui/react";
import React from "react";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { MdVerified } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";

const CommentModal = ({ onClose, post }) => {
  const user = useRecoilValue(userAtom);
  console.log(post);
  return (
    <Box p={5} bgColor={"gray.dark"}>
      <Flex gap={3}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name={user.name} src={user.avatar} />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box w={"full"}>
            <Avatar
              size={"md"}
              name="John Doe"
              src="https://bit.ly/dan-abramov"
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"md"} fontWeight={"bold"} mr={1}>
                {user.name}
              </Text>
              <MdVerified color="#2B96E9" />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontStyle={"sm"} color={"gray.light"}>
                1d
              </Text>
              <BsThreeDots onClick={(e) => e.preventDefault()} />
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.image && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid "}
              borderColor={"gray.light"}
            >
              <Image src={post.image} w={"full"} />
            </Box>
          )}
          <Stack gap={1} color={"gray.light"}>
            <Text color={"white"}>{user.username}</Text>
            <input
              placeholder="Add a comment"
              style={{
                width: "100%",
                background: "inherit",
                outline: "none",
                border: "none",
                padding: 0,
                color: "white",
              }}
              required
            />
          </Stack>
        </Flex>
      </Flex>
      <Flex>
        <Button
          mt={2}
          ml={"auto"}
          rounded={"full"}
          bg={"white"}
          color={"gray.dark"}
          sx={{ ":hover": { bg: "gray.100" } }}
        >
          Post
        </Button>
      </Flex>
    </Box>
  );
};

export default CommentModal;
