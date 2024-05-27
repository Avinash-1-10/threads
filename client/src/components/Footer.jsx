import React from "react";
import {
  Flex,
  useColorMode,
  useBreakpointValue,
  useDisclosure,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  IconButton,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { GoHome, GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { IoMdHeart } from "react-icons/io";
import { FaUser, FaRegUser } from "react-icons/fa6";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import CreatePost from "./CreatePost";

const Footer = () => {
  const { colorMode } = useColorMode();
  const showFullHeader = useBreakpointValue({ base: false, md: true });
  const user = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const path = location.pathname;

  const MenuItem = ({ to, activeIcon, inactiveIcon }) => (
    <Link to={to}>
      {path === to ? activeIcon : inactiveIcon}
    </Link>
  );

  return (
    <Flex
      w="100vw"
      fontSize="23px"
      alignItems="center"
      justifyContent="space-around"
      color={colorMode === "dark" ? "white" : "black"}
      bg={colorMode === "dark" ? "#101010" : "#EDF2F6"}
      position="fixed"
      bottom="0px"
      py={4}
    >
      <Flex
        fontSize="28px"
        gap={14}
        alignItems="center"
        justifyContent={"space-between"}
        color={colorMode === "dark" ? "white" : "gray.dark"}
      >
        <MenuItem to="/" activeIcon={<GoHomeFill />} inactiveIcon={<GoHome />} />
        <MenuItem to="/search" activeIcon={<FiSearch />} inactiveIcon={<FiSearch />} />
        <IconButton
          icon={<IoCreateOutline />}
          onClick={onOpen}
          bg="transparent"
          _hover={{ bg: "transparent" }}
          size={"28px"}
        />
        <AiOutlineHeart/>
        <MenuItem
          to={`/${user?.username}`}
          activeIcon={<FaUser />}
          inactiveIcon={<FaRegUser />}
        />
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <CreatePost onPostFormClose={onClose} />
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Footer;
