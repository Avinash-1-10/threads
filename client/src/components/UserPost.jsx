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
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useTimeAgo from "../hooks/useTimeAgo";

const UserPost = ({ post, user }) => {
  const showToast = useShowToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [reload, setReload] = useState(false);
  const [topComments, setTopComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const owner = useRecoilValue(userAtom);
  const timeAgo = useTimeAgo(post.createdAt);


  const getLikeCount = async () => {
    try {
      const { data } = await axios.get(`/api/v1/like/count/post/${post._id}`);
      setLikeCount(data.data.likeCount);
      setIsLiked(data.data.isLiked);
    } catch (error) {
      showToast("Error", error.response.data.message || error.message, "error");
    }
  };
  const getCommentCount = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/comment/count/post/${post._id}`
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

  useEffect(() => {
    getLikeCount();
    getCommentCount();
  }, [reload]);
  return (
    <Link to={`/${post.postByDetails.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name={user.name} src={user.avatar} />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
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
              <Text fontSize={"md"} fontWeight={"bold"}>
                {user.name}
              </Text>
              <MdVerified color="#2B96E9" />
              <Text fontStyle={"sm"} color={"gray.light"}>
              {timeAgo}
              </Text>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Box
                className="icon-container"
                onClick={(e) => e.preventDefault()}
              >
                <Menu>
                  <MenuButton>
                    <BsThreeDots onClick={(e) => e.preventDefault()} />
                  </MenuButton>
                  <Portal>
                    <MenuList bg={"gray.dark"}>
                      {owner?._id === post?.postByDetails?._id && (
                        <MenuItem bg={"gray.dark"}>Delete</MenuItem>
                      )}
                      <MenuItem bg={"gray.dark"}>View</MenuItem>
                      <MenuItem bg={"gray.dark"}>Report</MenuItem>
                      <MenuItem bg={"gray.dark"}>Share</MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              </Box>
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
          <Flex gap={3} my={1}>
            <Actions isLiked={isLiked} post={post} setReload={setReload} />
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

export default UserPost;
