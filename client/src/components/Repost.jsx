import React, { useEffect, useState } from "react";
import UserPost from "../components/UserPost";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import {
  Avatar,
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import UserPostSkeleton from "../skeletons/UserPostSkeleton";
import { Link, useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import RepostActions from "./RepostActions";
import useTimeAgo from "../hooks/useTimeAgo";
import userAtom from "../atoms/userAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import refreshAtom from "../atoms/refreshAtom";

const Repost = ({ repost, user }) => {
  const timeAgo = useTimeAgo(repost.createdAt);
  const showToast = useShowToast();
  const { colorMode } = useColorMode();
  const owner = useRecoilValue(userAtom);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [topComments, setTopComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const setRefresh = useSetRecoilState(refreshAtom);
  const refresh = useRecoilValue(refreshAtom);

  // console.log(repost)

  const getLikeCount = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/like/count/repost/${repost._id}`
      );
      setLikeCount(data.data.likeCount);
      setIsLiked(data.data.isLiked);
    } catch (error) {
      showToast("Error", error.response.data.message || error.message, "error");
    }
  };

  const getCommentCount = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/comment/count/repost/${repost._id}`
      );
      // console.log(data);
      setCommentCount(data.data.commentCount);
      setTopComments(data.data.topComments);
    } catch (error) {
      showToast(
        "Error",
        error?.response?.data?.message || error.message,
        "error"
      );
    }
  };

  const deletePost = async () => {
    try {
      const { data } = await axios.delete(`/api/v1/repost/${repost._id}`);
      showToast("Success", data.message, "success");
      setReload((prev) => !prev);
      setRefresh(!refresh);
    } catch (error) {
      showToast(
        "Error",
        error?.response?.data?.message || error.message,
        "error"
      );
    }
  };

  useEffect(() => {
    getLikeCount();
    getCommentCount();
  }, [reload]);

  // console.log(topComments)

  return (
    <Link to={`/${user?.username}/repost/${repost._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name={user?.name} src={user?.avatar} />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"} mb={5}>
            {topComments.length > 0 ? (
              <>
                {topComments.length >= 1 && (
                  <Avatar
                    size={"xs"}
                    name={topComments[0].commentBy.name}
                    src={topComments[0].commentBy.avatar}
                    position={"absolute"}
                    top={"0px"}
                    left="15px"
                    padding={"2px"}
                  />
                )}
                {topComments.length >= 2 && (
                  <Avatar
                    size={"xs"}
                    name={topComments[1].commentBy.name}
                    src={topComments[1].commentBy.avatar}
                    position={"absolute"}
                    bottom={"0px"}
                    right="-5px"
                    padding={"2px"}
                  />
                )}
                {topComments.length >= 3 && (
                  <Avatar
                    size={"xs"}
                    name={topComments[2].commentBy.name}
                    src={topComments[2].commentBy.avatar}
                    position={"absolute"}
                    bottom={"0px"}
                    left="4px"
                  />
                )}
              </>
            ) : (
              <Text fontSize={"25px"} textAlign={"center"}>
                😞
              </Text>
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"} gap={2}>
              <Text
                fontSize={"md"}
                fontWeight={"bold"}
                onClick={(e) => (
                  e.preventDefault(), navigate(`/${user.username}`)
                )}
                _hover={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {user?.name}
              </Text>
              <MdVerified color="#2B96E9" />
              <Text fontStyle={"sm"} color={"gray.light"}>
                {timeAgo}
              </Text>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Box onClick={(e) => e.preventDefault()}>
                <Menu>
                  <MenuButton>
                    <BsThreeDots onClick={(e) => e.preventDefault()} />
                  </MenuButton>
                  <Portal>
                    <MenuList bg={colorMode === "dark" ? "gray.dark" : "white"}>
                      {owner?._id === user?._id && (
                        <MenuItem
                          color={"red"}
                          onClick={deletePost}
                          bg={colorMode === "dark" ? "gray.dark" : "white"}
                        >
                          Delete
                        </MenuItem>
                      )}
                      <MenuItem
                        bg={colorMode === "dark" ? "gray.dark" : "white"}
                      >
                        View
                      </MenuItem>
                      <MenuItem
                        bg={colorMode === "dark" ? "gray.dark" : "white"}
                      >
                        Report
                      </MenuItem>
                      <MenuItem
                        bg={colorMode === "dark" ? "gray.dark" : "white"}
                      >
                        Share
                      </MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              </Box>
            </Flex>
          </Flex>
          <Text>{repost?.text}</Text>
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
          <Flex gap={3} my={1}>
            <RepostActions
              isLiked={isLiked}
              repost={repost}
              setReload={setReload}
            />
          </Flex>
          <Flex gap={2} alignItems={"center"} color={"gray.light"}>
            <Text fontSize={"small"}>{commentCount} replies</Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text fontSize={"small"}>{likeCount} likes</Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Repost;
