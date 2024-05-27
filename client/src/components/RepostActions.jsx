import React from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FiShare } from "react-icons/fi";
import {
  Box,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import RepostCommentModal from "./RepostCommentModal";
import useCopyLink from "../hooks/useCopyLink";

const IconButton = ({ children, onClick, hoverColor, hoverBgColor }) => (
  <Box
    py={1}
    px={3}
    borderRadius={"full"}
    _hover={{
      color: hoverColor,
      bgColor: hoverBgColor,
      transition:
        "color 0.3s ease-in-out, background-color 0.3s ease-in-out",
    }}
    onClick={onClick}
  >
    {children}
  </Box>
);

const RepostActions = ({ isLiked, repost, setReload }) => {
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { copyURL } = useCopyLink();

  const likeUnlike = async () => {
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

  const copyPostLink = () => {
    copyURL(`${repost.postByDetails.username}/repost/${repost._id}`);
  };

  return (
    <Flex
      gap={2}
      my={2}
      fontSize={"20px"}
      alignItems={"center"}
      onClick={(e) => e.preventDefault()}
    >
      <IconButton
        onClick={likeUnlike}
        hoverColor="rgb(237, 73, 86)"
        hoverBgColor="rgb(249, 212, 215)"
      >
        {isLiked ? (
          <FaHeart color="rgb(237, 73, 86)" cursor={"pointer"} />
        ) : (
          <FaRegHeart cursor={"pointer"} />
        )}
      </IconButton>

      <IconButton
        onClick={onOpen}
        hoverColor="rgb(76, 73, 237)"
        hoverBgColor="rgb(205, 205, 249)"
      >
        <IoChatbubbleOutline cursor={"pointer"} />
      </IconButton>

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

      <IconButton
        onClick={copyPostLink}
        hoverColor="rgb(6, 117, 165)"
        hoverBgColor="rgb(205, 236, 249)"
      >
        <FiShare cursor={"pointer"} />
      </IconButton>
    </Flex>
  );
};

export default RepostActions;
