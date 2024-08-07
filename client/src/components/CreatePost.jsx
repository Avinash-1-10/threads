import {
  Avatar,
  Button,
  Flex,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { MdOutlineGifBox } from "react-icons/md";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import refreshAtom from "../atoms/refreshAtom";
import { MdOutlinePoll } from "react-icons/md";
import CreatePollForm from "./CreatePollForm";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreatePost = ({ onPostFormClose }) => {
  const user = useRecoilValue(userAtom);
  const { colorMode } = useColorMode();
  const showToast = useShowToast();
  const fileRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl, imgFile } = usePreviewImg();
  const [text, setText] = useState("");
  const [loading, seLoading] = useState(false);
  const setRefresh = useSetRecoilState(refreshAtom);
  const refresh = useRecoilValue(refreshAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    seLoading(true);
    const formData = new FormData();
    formData.append("text", text);
    formData.append("image", imgFile);
    try {
      const { data } = await axios.post(`${BACKEND_URL}/post/create`, formData);
      setText("");
      setImgUrl(null);
      setRefresh(!refresh);
      showToast("Success", data.message, "success");
      onPostFormClose();
    } catch (error) {
      console.log(error);
      showToast(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    } finally {
      seLoading(false);
    }
  };

  return (
    <Flex
      p={4}
      border={"1px solid"}
      borderColor={"gray.800"}
      bgColor={colorMode === "dark" ? "gray.dark" : "#EDF2F6"}
      gap={2}
      rounded={"md"}
    >
      <Stack>
        <Avatar src={user.avatar} name={user.name} />
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
          required
          value={text}
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
          <MdOutlinePoll cursor={"pointer"} onClick={onOpen} />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <CreatePollForm
                onClose={onClose}
                onPostFormClose={onPostFormClose}
              />
            </ModalContent>
          </Modal>
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
          bg={colorMode === "dark" ? "white" : "gray.dark"}
          color={colorMode === "dark" ? "gray.dark" : "white"}
          sx={{ ":hover": { bg: colorMode === "dark" ? "white" : "gray.800" } }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Post"}
        </Button>
      </Stack>
    </Flex>
  );
};

export default CreatePost;
