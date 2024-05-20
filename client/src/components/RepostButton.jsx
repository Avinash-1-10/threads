import { Box, Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { BiRepost } from "react-icons/bi";
import RepostModal from "./RepostModal";
import { FaRetweet } from "react-icons/fa6";

const RepostButton = ({post, setReload}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Box
        py={1}
        px={3}
        borderRadius={"full"}
        _hover={{ color: "rgb(2, 153, 45)", bgColor: "rgb(205, 249, 211)" }}
        
      >
      <FaRetweet size={"22px"} cursor={"pointer"} onClick={onOpen} />
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
