import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
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
import { MdVerified } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import PostPageSkeleton from "../skeletons/PostPageSkeleton";
import RepostActions from "../components/RepostActions";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import NotFound from "../components/NotFound";
import BackButton from "../components/BackButton";

const RepostPage = () => {
  const { pid } = useParams();
  const [repost, setRepost] = useState({});
  const showToast = useShowToast();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [reload, setReload] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [timeAgo, setTimeAgo] = useState("");
  const { colorMode } = useColorMode();
  const owner = useRecoilValue(userAtom);
  const navigate = useNavigate();
  // console.log(repost)

  const getLikeData = async () => {
    try {
      const { data } = await axios.get(
        `https://threads-ffw7.onrender.com/api/v1/like/count/repost/${repost._id || pid}`
      );
      // console.log(data)
      setLikeCount(data.data.likeCount);
      setIsLiked(data.data.isLiked);
    } catch (error) {
      console.log("error");
    }
  };

  const getCommentData = async () => {
    try {
      const { data } = await axios.get(
        `https://threads-ffw7.onrender.com/comment/repost/${repost._id || pid}`
      );
      setComments(data.data.comments);
      setCommentCount(data.data.commentCount);
    } catch (error) {
      console.log("error");
    }
  };

  const deletePost = async () => {
    try {
      const { data } = await axios.delete(`https://threads-ffw7.onrender.com/repost/${repost._id}`);
      showToast("Success", data.message, "success");
      navigate("/");
    } catch (error) {
      showToast(
        "Error",
        error?.response?.data?.message || error.message,
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: postData } = await axios.get(`https://threads-ffw7.onrender.com/repost/${pid}`);
        setRepost(postData.data);
        // console.log(postData.data)
        let date = new Date(postData.data.createdAt);
        let d = date.getDate();
        let m = date.getMonth() + 1;
        let y = date.getFullYear();
        setTimeAgo(`${d}/${m}/${y}`);
        if (postData.post?._id) {
          const { data: likeData } = await axios.get(
            `https://threads-ffw7.onrender.com/api/v1/like/count/repost/${postData.data._id}`
          );
          const { data: comments } = await axios.get(
            `https://threads-ffw7.onrender.com/api/v1/comment/post/${postData.data._id}`
          );
          setComments(comments.data.comments);
          setCommentCount(comments.data.commentCount);
          setLikeCount(likeData.data.likeCount);
          setIsLiked(likeData.data.isLiked);
        }
      } catch (error) {
        showToast(
          "Error",
          error.response?.data.message || error.message,
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pid]);

  useEffect(() => {
    getLikeData();
    getCommentData();
  }, [reload]);

  if (loading) {
    return <PostPageSkeleton />;
  }

  if (!repost?._id) {
    return <NotFound text={"Repost"} />;
  }

  return (
    <>
      <Box mb={6}>
        <BackButton />
      </Box>
      <Flex alignItems={"center"} gap={3}>
        <Avatar
          src={repost?.repostByDetails?.avatar}
          size={"md"}
          name={repost?.repostByDetails?.name}
        />
        <Flex alignItems={"center"} gap={2}>
          <Text fontWeight={"bold"}>{repost?.repostByDetails?.name}</Text>
          <MdVerified color="#2B96E9" />
        </Flex>
        <Flex gap={4} alignItems={"center"} ml={"auto"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            {timeAgo}
          </Text>
          <Flex gap={4} alignItems={"center"}>
            <Box onClick={(e) => e.preventDefault()}>
              <Menu>
                <MenuButton>
                  <BsThreeDots onClick={(e) => e.preventDefault()} />
                </MenuButton>
                <Portal>
                  <MenuList bg={colorMode === "dark" ? "gray.dark" : "white"}>
                    {owner?._id === repost.repostByDetails?._id && (
                      <MenuItem
                        color={"red"}
                        onClick={deletePost}
                        bg={colorMode === "dark" ? "gray.dark" : "white"}
                      >
                        Delete
                      </MenuItem>
                    )}
                    <MenuItem bg={colorMode === "dark" ? "gray.dark" : "white"}>
                      View
                    </MenuItem>
                    <MenuItem bg={colorMode === "dark" ? "gray.dark" : "white"}>
                      Report
                    </MenuItem>
                    <MenuItem bg={colorMode === "dark" ? "gray.dark" : "white"}>
                      Share
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Text my={3}>{repost?.text}</Text>
      <Stack
        p={5}
        border={"1px solid"}
        borderColor={"gray.light"}
        rounded={"md"}
      >
        <Flex alignItems={"center"} gap={2}>
          <Avatar
            size={"sm"}
            name={repost?.postByDetails?.avatar}
            src={repost?.postByDetails?.avatar}
          />
          <Text size={"sm"} fontWeight={"bold"}>
            {repost?.postByDetails?.name}
          </Text>
          <MdVerified size={"15px"} color="#2B96E9" />
        </Flex>
        <Text fontSize={"sm"}>{repost?.postDetails?.text}</Text>
        {repost?.postDetails?.image && (
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid "}
            borderColor={"gray.light"}
          >
            <Image src={repost?.postDetails?.image} w={"full"} />
          </Box>
        )}
      </Stack>

      <Flex gap={3} my={3}>
        <RepostActions
          isLiked={isLiked}
          repost={repost}
          setReload={setReload}
        />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {commentCount} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {likeCount} likes
        </Text>
      </Flex>

      <Divider my={4} />
      {comments.length > 0 ? (
        comments.map((comment, i) => (
          <Comment
            comment={comment}
            key={i}
            handleReload={() => setReload((prev) => !prev)}
          />
        ))
      ) : (
        <Text textAlign={"center"} color={"gray.light"} fontSize={"md"}>
          No comments
        </Text>
      )}
    </>
  );
};

export default RepostPage;
