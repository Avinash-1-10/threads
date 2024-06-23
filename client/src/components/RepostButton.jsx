import {
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiRepost } from "react-icons/bi";
import RepostModal from "./RepostModal";
import { FaRetweet } from "react-icons/fa6";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";

const RepostButton = ({ post, setReload }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isReposted, setIsReposted] = useState(false);
  const showToast = useShowToast();

  const checkReposted = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/repost/check-reposted/${post._id}`
      );
      setIsReposted(data.isReposted);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkReposted();
  },[setReload])

  const showError = ()=>{
    showToast("Error", "Repost can only be done once", "error");
  }
  return (
    <Box>
      <Box
        py={1}
        px={3}
        borderRadius={"full"}
        _hover={{
          color: "rgb(2, 153, 45)",
          bgColor: "rgb(205, 249, 211)",
          transition: "color 0.3s ease-in-out, background-color 0.3s ease-in-out",
        }}
        color={isReposted ? "#0ddb11" : "inherit"}
        onClick={isReposted ? showError : onOpen}
      >
        <FaRetweet size={"22px"} cursor={"pointer"} />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <RepostModal onClose={onClose} post={post} setReload={setReload} />
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RepostButton;
