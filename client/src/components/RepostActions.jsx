import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { IoChatbubbleOutline } from "react-icons/io5";
import { BiRepost } from "react-icons/bi";
import { FiShare } from "react-icons/fi";
import {
  Box,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import CommentModal from "./CommentModal";
import RepostModal from "./RepostModal";
import RepostButton from "./RepostButton";
import RepostCommentModal from "./RepostCommentModal";

const RepostActions = ({ isLiked, repost, setReload }) => {
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const likeUnlike = async () => {
    console.log("Clicked");
    try {
      const { data } = await axios.post(`/api/v1/like/repost/${repost._id}`);
      showToast("Success", data.message, "success");
      setReload((prev) => !prev);
    } catch (error) {
      showToast(
        "Error",
        error?.response?.data?.message || error.message,
        "error"
      );
    }
  };
  return (
    <Flex
      gap={2}
      my={2}
      fontSize={"20px"}
      alignItems={"center"}
      onClick={(e) => e.preventDefault()}
    >
      {isLiked ? (
        <Box
          py={1}
          px={3}
          borderRadius={"full"}
          _hover={{
            color: "rgb(237, 73, 86)",
            bgColor: "rgb(249, 212, 215)",
            transition:
              "color 0.3s ease-in-out, background-color 0.3s ease-in-out",
          }}
          onClick={likeUnlike}
        >
          <FaHeart
            color="rgb(237, 73, 86)"
            cursor={"pointer"}
            onClick={likeUnlike}
          />
        </Box>
      ) : (
        <Box
          py={1}
          px={3}
          borderRadius={"full"}
          _hover={{
            color: "rgb(237, 73, 86)",
            bgColor: "rgb(249, 212, 215)",
            transition:
              "color 0.3s ease-in-out, background-color 0.3s ease-in-out",
          }}
          onClick={likeUnlike}
        >
          <FaRegHeart cursor={"pointer"} onClick={likeUnlike} />
        </Box>
      )}
      <Box
        py={1}
        px={3}
        borderRadius={"full"}
        _hover={{
          color: "rgb(76, 73, 237)",
          bgColor: "rgb(205, 205, 249)",
          transition:
            "color 0.3s ease-in-out, background-color 0.3s ease-in-out",
        }}
        onClick={onOpen}
      >
        <IoChatbubbleOutline cursor={"pointer"} onClick={onOpen} />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <RepostCommentModal
            onClose={onClose}
            repost={repost}
            setReload={setReload}
          />
        </ModalContent>
      </Modal>
      <Box
        py={1}
        px={3}
        borderRadius={"full"}
        _hover={{
          color: "rgb(6, 117, 165)",
          bgColor: "rgb(205, 236, 249)",
          transition:
            "color 0.3s ease-in-out, background-color 0.3s ease-in-out",
        }}
        onClick={onOpen}
      >
        <FiShare cursor={"pointer"} />
      </Box>
    </Flex>
  );
};

export default RepostActions;
