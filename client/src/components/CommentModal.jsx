import {
  Avatar,
  Box,
  Flex,
  Text,
  Image,
  Stack,
  Button,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { MdVerified } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";

const CommentModal = ({ onClose, post, setReload }) => {
  const showToast = useShowToast();
  const user = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const addComment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/v1/comment/${post._id}`, {
        text,
      });
      showToast("Success", data.message, "success");
      setReload((prev) => !prev);
      onClose();
    } catch (error) {
      showToast(
        "Error",
        error?.response?.data?.message || error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box p={5} bgColor={"gray.dark"}>
      <Flex gap={3}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={post?.postByDetails?.avatar || post.postBy.avatar}
            src={post?.postByDetails?.avatar || post.postBy.avatar}
          />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box w={"full"}>
            <Avatar size={"md"} name={user.name} src={user.avatar} />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"md"} fontWeight={"bold"} mr={1}>
                {post?.postByDetails?.name || post?.postBy?.name}
              </Text>
              <MdVerified color="#2B96E9" />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontStyle={"sm"} color={"gray.light"}>
                1d
              </Text>
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
            <Text color={"white"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <input
              placeholder={`Reply to ${post?.postByDetails?.username || post?.postBy?.username}...`}
              style={{
                width: "100%",
                background: "inherit",
                outline: "none",
                border: "none",
                padding: 0,
                color: "white",
              }}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
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
          onClick={addComment}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Post"}
        </Button>
      </Flex>
    </Box>
  );
};

export default CommentModal;
