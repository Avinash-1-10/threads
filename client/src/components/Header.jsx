import { Flex, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import React from "react";
import { FaThreads } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { IoMdHeart } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoCreateOutline } from "react-icons/io5";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const showFullHeader = useBreakpointValue({ base: false, md: true });
  return (
    <Flex
      w={"full"}
      justifyContent={"space-between"}
      pt={6}
      pb={4}
      px={showFullHeader ? 120 : 2}
      position={"fixed"}
      top={0}
      zIndex={60}
      bg={colorMode === "dark" ?"#101010":"#EDF2F6"}
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

      <HiOutlineMenuAlt3
        fontSize={showFullHeader ? "28px" : "23px"}
        color={"gray"}
      />
    </Flex>
  );
};

export default Header;
