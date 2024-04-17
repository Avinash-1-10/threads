import { Flex, useColorMode } from "@chakra-ui/react";
import React from "react";
import { FaThreads } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { IoMdHeart } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoCreateOutline } from "react-icons/io5";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // Destructuring colorMode and toggleColorMode
  return (
    <Flex w={"full"} justifyContent={"space-between"} mt={6} mb={12} px={120}>
      <FaThreads
        style={{
          color: colorMode === "dark" ? "white" : "black",
          fontSize: "30px",
          cursor: "pointer",
        }}
        onClick={toggleColorMode}
      />
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
        <FaUser color="white"/>
      </Flex>
      <HiOutlineMenuAlt3 fontSize={"28px"} color="gray.light" />
    </Flex>
  );
};

export default Header;
