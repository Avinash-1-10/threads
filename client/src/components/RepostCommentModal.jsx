import React, { useState } from 'react'
import useShowToast from '../hooks/useShowToast';
import { Avatar, Box, Button, Flex, Image, Spinner, Stack, Text, useColorMode } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useTimeAgo from '../hooks/useTimeAgo';
import {MdVerified} from 'react-icons/md';
import axios from 'axios';

const RepostCommentModal = ({repost, onClose, setReload}) => {
    const showToast = useShowToast();
    const { colorMode } = useColorMode();
    const user = useRecoilValue(userAtom);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const timeAgo = useTimeAgo(repost?.createdAt);

    const addComment = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(`/api/v1/comment/repost/${repost._id}`, {
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
      <Box
        p={5}
        bgColor={colorMode === "dark" ? "#101010" : "#EDF2F6"}
        rounded={5}
      >
        <Flex gap={3}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar
              size={"md"}
              name={repost?.postByDetails?.avatar || repost.postByDetails.avatar}
              src={repost?.postByDetails?.avatar || repost.postByDetails.avatar}
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
                  {repost?.postByDetails?.name || repost?.postByDetails?.name}
                </Text>
                <MdVerified color="#2B96E9" />
              </Flex>
              <Flex gap={4} alignItems={"center"}>
                <Text fontStyle={"sm"} color={"gray.light"}>
                  {timeAgo}
                </Text>
              </Flex>
            </Flex>
            <Text fontSize={"sm"}>{repost.text}</Text>
            <Stack
            p={5}
            border={"1px solid"}
            borderColor={"gray.light"}
            rounded={"md"}
          >
            <Flex alignItems={"center"} gap={2}>
              <Avatar
                size={"sm"}
                name={repost.postByDetails.avatar}
                src={repost.postByDetails?.avatar}
              />
              <Text size={"sm"} fontWeight={"bold"}>
                {repost?.postByDetails.name}
              </Text>
              <MdVerified size={"15px"} color="#2B96E9" />
            </Flex>
            <Text fontSize={"sm"}>{repost?.postDetails.text}</Text>
            {repost.postDetails.image && (
              <Box
                borderRadius={6}
                overflow={"hidden"}
                border={"1px solid "}
                borderColor={"gray.light"}
              >
                <Image src={repost.postDetails.image} w={"full"} />
              </Box>
            )}
          </Stack>
            <Stack gap={1}>
              <Text fontWeight={"bold"}>{user.username}</Text>
              <input
                placeholder={`Reply to ${
                  repost?.postByDetails?.username || repost?.postBy?.username
                }...`}
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
            onClick={addComment}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Post"}
          </Button>
        </Flex>
      </Box>)
}

export default RepostCommentModal