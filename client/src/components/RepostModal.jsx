import {
  Avatar,
  Box,
  Flex,
  Text,
  Image,
  Stack,
  Button,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import React, { useState } from "react";
import userAtom from "../atoms/userAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { MdVerified } from "react-icons/md";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import useTimeAgo from "../hooks/useTimeAgo";
import refreshAtom from "../atoms/refreshAtom";

const RepostModal = ({ onClose, post, setReload }) => {
  const showToast = useShowToast();
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const timeAgo = useTimeAgo(post?.createdAt);
  const owner = useRecoilValue(userAtom);
  const setRefresh = useSetRecoilState(refreshAtom);
  const refresh = useRecoilValue(refreshAtom);
  const createRepost = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/v1/repost/${post._id}`, {
        text,
      });
      showToast("Success", data.message, "success");
      setReload((prev) => !prev);
      setRefresh(!refresh);
      onClose();
    } catch (error) {
      showToast(
        "Error",
        error?.response?.data?.message || error.message,
        "error"
      );
      }
  };

  // console.log(owner)
  return (
    <Box
      p={5}
      bgColor={colorMode === "dark" ? "#101010" : "#EDF2F6"}
      rounded={5}
    >
      <Flex gap={3}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={owner?.name}
            src={owner?.avatar}
          />
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"md"} fontWeight={"bold"} mr={1}>
                {owner.name}
              </Text>
              <MdVerified color="#2B96E9" />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontStyle={"sm"} color={"gray.light"}>
                {timeAgo}
              </Text>
            </Flex>
          </Flex>

          <input
            placeholder={"Add a comment..."}
            style={{
              width: "100%",
              background: "inherit",
              outline: "none",
              border: "none",
              padding: 0,
              color: colorMode == "dark" ? "white" : "black",
            }}
            type="text"
            autoFocus
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Stack m={0} border={"1px solid"} borderColor={"gray.light"} p={3} borderRadius={6}>
          <Flex gap={3} alignItems={"center"}>
          <Avatar
            size={"sm"}
            name={post?.postByDetails?.avatar || post.postBy.avatar}
            src={post?.postByDetails?.avatar || post.postBy.avatar}
          />
          <Text fontSize={"sm"} fontWeight={"bold"} mr={1}>
                {post?.postByDetails?.name || post?.postBy?.name}
              </Text>
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
          </Stack>
        </Flex>
      </Flex>
      
      <Flex>
        <Button
          mt={2}
          ml={"auto"}
          rounded={"full"}
          bg={colorMode === "dark" ? "white" : "gray.dark"}
          color={colorMode === "dark" ? "gray.dark" : "white"}
          sx={{ ":hover": { bg: colorMode === "dark" ? "white" : "gray.800" } }}
          disabled={loading}
          onClick={createRepost}
          onKeyDown={(e) => {
            if (e.key === "Enter") createRepost();
          }}
        >
          {loading ? <Spinner /> : "Repost"}
        </Button>
      </Flex>
    </Box>
  );
};

export default RepostModal;
