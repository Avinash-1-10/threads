import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { IoChatbubbleOutline } from "react-icons/io5";
import { BiRepost } from "react-icons/bi";
import { TbSend } from "react-icons/tb";
import {
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
    console.log("Clicked")
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
      gap={4}
      my={2}
      fontSize={"20px"}
      alignItems={"center"}
      onClick={(e) => e.preventDefault()}
    >
      {isLiked ? (
        <FaHeart
          color="rgb(237, 73, 86)"
          cursor={"pointer"}
          onClick={likeUnlike}
        />
      ) : (
        <FaRegHeart cursor={"pointer"} onClick={likeUnlike} />
      )}
      <IoChatbubbleOutline cursor={"pointer"} onClick={onOpen} />
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
      <TbSend cursor={"pointer"} />
    </Flex>
  );
};

export default RepostActions;
