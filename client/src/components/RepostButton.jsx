import { Box, Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { BiRepost } from "react-icons/bi";
import RepostModal from "./RepostModal";

const RepostButton = ({post, setReload}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <BiRepost fontSize={"30px"} cursor={"pointer"} onClick={onOpen} />
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
