import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { IoChatbubbleOutline } from "react-icons/io5";
import { BiRepost } from "react-icons/bi";
import { TbSend } from "react-icons/tb";
import { Flex } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";

const Actions = ({ liked, setLiked }) => {
    const toggleLike = ()=>{
        setLiked(prev=>!prev)
    }
  return (
    <Flex
      gap={4}
      my={2}
      fontSize={"20px"}
      alignItems={"center"}
      onClick={(e) => e.preventDefault()}
    >
      {liked ? <FaHeart color="rgb(237, 73, 86)" onClick={toggleLike} cursor={"pointer"}/> : <FaRegHeart onClick={toggleLike} cursor={"pointer"}/>}
      <IoChatbubbleOutline cursor={"pointer"}/>
      <BiRepost fontSize={"30px"} cursor={"pointer"}/>
      <TbSend cursor={"pointer"}/>
    </Flex>
  );
};

export default Actions;
