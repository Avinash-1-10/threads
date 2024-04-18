import { Flex, useColorMode } from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { IoMdHeart } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";

const Footer = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex
      w={"full"}
      fontSize={"23px"}
      alignItems={"center"}
      justifyContent={"space-around"}
      color={colorMode === "dark" ?"white":"black"}
      bg={colorMode === "dark" ?"#101010":"#EDF2F6"}
      position={"fixed"}
      bottom={"0px"}
      px={2}
      py={4}
    >
      <GoHomeFill />
      <FiSearch />
      <IoCreateOutline />
      <IoMdHeart />
      <FaUser />
    </Flex>
  );
};

export default Footer;
