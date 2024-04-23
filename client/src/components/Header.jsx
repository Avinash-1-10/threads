import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
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

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const showFullHeader = useBreakpointValue({ base: false, md: true });
  const user = useRecoilValue(userAtom);
  return (
    <Flex
      w={"full"}
      justifyContent={"space-between"}
      pt={6}
      pb={4}
      px={showFullHeader ? 120 : 2}
      position={"fixed"}
      top={0}
      zIndex={40}
      bg={colorMode === "dark" ? "#101010" : "#EDF2F6"}
    >
      <FaThreads
        style={{
          color: colorMode === "dark" ? "white" : "black",
          fontSize: showFullHeader ? "35px" : "28px",
          cursor: "pointer",
        }}
        onClick={toggleColorMode}
      />
      {showFullHeader && (
        <Flex
          fontSize={"28px"}
          gap={20}
          alignItems={"center"}
          color={"gray.light"}
        >
          <GoHomeFill />
          <FiSearch />
          <IoCreateOutline />
          <IoMdHeart />
          <FaUser color="white" />
        </Flex>
      )}

      <Menu>
        <MenuButton>
          <HiOutlineMenuAlt3
            fontSize={showFullHeader ? "28px" : "23px"}
            color={"gray"}
          />
        </MenuButton>
        <Portal>
          <MenuList bg={"gray.dark"} zIndex={60}>
            <MenuItem bg={"gray.dark"}>{user && <LogoutButton />}</MenuItem>
          </MenuList>
        </Portal>
      </Menu>
    </Flex>
  );
};

export default Header;
