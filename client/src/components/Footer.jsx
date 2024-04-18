import { Flex } from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { IoMdHeart } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";

const Footer = () => {
  return (
    <Flex
      w={"full"}
      fontSize={"23px"}
      alignItems={"center"}
      justifyContent={"space-around"}
      color={"white"}
      bg={"#101010"}
      position={"fixed"}
      bottom={"0px"}
      px={2}
      py={4}
    >
      <GoHomeFill />
      <FiSearch />
      <IoCreateOutline />
      <IoMdHeart />
      <FaUser color="white" />
    </Flex>
  );
};

export default Footer;
