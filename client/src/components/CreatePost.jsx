import { Button, Flex, Image, Input, Stack, Text } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { MdOutlineGifBox } from "react-icons/md";
import usePreviewImg from "../hooks/usePreviewImg";

const CreatePost = () => {
  const user = useRecoilValue(userAtom);
  const fileRef = useRef(null);
  const { handleImageChange, imgUrl, imgFile } = usePreviewImg();
  const [text, setText] = useState("");

  return (
    <Flex
      p={4}
      border={"1px solid"}
      borderColor={"gray.700"}
      bgColor={"gray.dark"}
      gap={2}
      rounded={"md"}
    >
      <Stack>
        <Image src={user.avatar} h={12} w={12} borderRadius={"full"} />
      </Stack>
      <Stack flex={1}>
        <Text fontWeight={"bold"}>{user.username}</Text>
        <input
          placeholder="Start a thread..."
          style={{
            width: "100%",
            background: "inherit",
            outline: "none",
            border: "none",
            padding: 0,
          }}
          onChange={(e) => setText(e.target.value)}
        />
        {imgUrl && (
          <Image src={imgUrl} w={"100%"} objectFit={"cover"} rounded={"lg"} />
        )}
        <Flex gap={5} fontSize={"23px"} color={"gray"}>
          <MdOutlinePhotoLibrary
            cursor={"pointer"}
            onClick={() => fileRef.current.click()}
          />
          <MdOutlineGifBox cursor={"not-allowed"} />
          <input
            type="file"
            accept="image/*"
            id="avatar"
            style={{ display: "none" }}
            ref={fileRef}
            onChange={handleImageChange}
          />
        </Flex>
        <Button
          ml={"auto"}
          rounded={"full"}
          bg={"white"}
          color={"gray.dark"}
          sx={{ ":hover": { bg: "gray.100" } }}
        >
          Post
        </Button>
      </Stack>
    </Flex>
  );
};

export default CreatePost;
