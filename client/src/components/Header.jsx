import React from "react";
import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useBreakpointValue,
  useColorMode,
  IconButton,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/react";
import { FaThreads } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { IoMdHeart } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoCreateOutline } from "react-icons/io5";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import LogoutButton from "./LogoutButton";
import CreatePost from "./CreatePost";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const showFullHeader = useBreakpointValue({ base: false, md: true });
  const user = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      w="full"
      justifyContent="space-between"
      pt={6}
      pb={4}
      px={showFullHeader ? 120 : 2}
      position="fixed"
      top={0}
      zIndex={40}
      bg={colorMode === "dark" ? "#101010" : "#EDF2F6"}
    >
      <IconButton
        aria-label="Toggle Theme"
        icon={<FaThreads />}
        onClick={toggleColorMode}
        color={colorMode === "dark" ? "white" : "black"}
        fontSize={showFullHeader ? "35px" : "28px"}
        variant="ghost"
        cursor="pointer"
      />
      {showFullHeader && (
        <Flex fontSize="28px" gap={20} alignItems="center" color="gray.500">
          <GoHomeFill />
          <FiSearch />
          <IoCreateOutline cursor={"pointer"} onClick={onOpen}/>
          <IoMdHeart />
          <FaUser color="white" />
        </Flex>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <CreatePost onClose={onClose} />
          </ModalContent>
        </Modal>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HiOutlineMenuAlt3 fontSize="24px" color="white" />}
        />
        <Portal>
          <MenuList bg="gray.700" zIndex={60}>
            {user && (
              <MenuItem>
                <LogoutButton />
              </MenuItem>
            )}
          </MenuList>
        </Portal>
      </Menu>
    </Flex>
  );
};

export default Header;
