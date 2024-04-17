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
      gap={3}
      my={2}
      fontSize={"23px"}
      alignItems={"center"}
      onClick={(e) => e.preventDefault()}
    >
      {liked ? <FaHeart color="#F30B74" onClick={toggleLike}/> : <FaRegHeart onClick={toggleLike}/>}
      <IoChatbubbleOutline />
      <BiRepost fontSize={"30px"} />
      <TbSend />
    </Flex>
  );
};

export default Actions;
