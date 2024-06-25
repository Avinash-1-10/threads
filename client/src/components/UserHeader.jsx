import React, { useEffect, useState } from "react";
import {
  VStack,
  Box,
  Flex,
  Avatar,
  Text,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  MenuItem,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import useShowToast from "../hooks/useShowToast";
import UpdateProfileCard from "./UpdateProfileCard";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import axios from "axios";

const UserHeader = ({ user }) => {
  const showToast = useShowToast();
  const owner = useRecoilValue(userAtom);
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [followersCount, setFollowersCount] = useState("...");
  const [followingCount, setFollowingCount] = useState("...");
  const [isFollowing, setIsFollowing] = useState("...");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast("Success", "Profile link copied.", "success");
    });
  };

  const getFollowers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://threads-ffw7.onrender.com/api/v1/follow/follwers/${user._id}`);
      setFollowersCount(data.data.totalCount);
    } catch (error) {
      if (error?.response?.data?.message) {
        showToast(
          "Error",
          error?.response?.data?.message || error.message,
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getFollowing = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://threads-ffw7.onrender.com/follow/following/${user._id}`);
      setFollowingCount(data.data.totalCount);
    } catch (error) {
      if (error?.response?.data?.message) {
        showToast(
          "Error",
          error?.response?.data?.message || error.message,
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const followUser = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`https://threads-ffw7.onrender.com/follow/${user._id}`);
      showToast("Success", data.message, "success");
      setReload((prev) => !prev);
    } catch (error) {
      if (error?.response?.data?.message) {
        showToast(
          "Error",
          error?.response?.data?.message || error.message,
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const checkFollowing = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://threads-ffw7.onrender.com/api/v1/follow/check/following/${user._id}`
      );
      setIsFollowing(data.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        showToast(
          "Error",
          error?.response?.data?.message || error.message,
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFollowers();
    checkFollowing();
    getFollowing();
  }, []);

  useEffect(() => {
    getFollowers();
    checkFollowing();
    getFollowing();
  }, [reload]);
  return (
    <div>
      <VStack gap={4} alignItems="start">
        <Flex justifyContent={"space-between"} w={"full"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              {user?.name}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>{user?.username}</Text>
              <Text
                fontSize={"xs"}
                bg={colorMode === "dark" ? "gray.dark" : "#e0e0e0"}
                color={colorMode === "dark" ? "gray.light" : "black"}
                p={1}
                px={2}
                borderRadius={"full"}
              >
                threads.net
              </Text>
            </Flex>
          </Box>
          <Box>
            <Avatar
              name={user?.name}
              src={user?.avatar}
              size={{
                base: "lg",
                md: "xl",
              }}
            />
          </Box>
        </Flex>
        <Text>{user?.bio}</Text>
        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>{followersCount} Followers</Text>
            <Box w={1} h={1} bg={"gray"} borderRadius={"full"}></Box>
            <Text color={"gray.light"}>{followingCount} Following</Text>
          </Flex>
          <Flex>
            <Box className="icon-container">
              <BsInstagram size={24} cursor={"pointer"} />
            </Box>
            <Box className="icon-container">
              <Menu>
                <MenuButton>
                  <CgMoreO size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                  <MenuList bg={"gray.dark"}>
                    <MenuItem bg={"gray.dark"} onClick={copyURL}>
                      Copy link
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>
        {owner?._id === user?._id ? (
          <Button
            w={"full"}
            p={1}
            border={"0.5px solid"}
            borderColor={"gray.light"}
            h={"35px"}
            bg={"inherit"}
            style={{ fontSize: "14px", padding: "1" }}
            _hover={{ bg: "inherit" }}
            onClick={onOpen}
          >
            Edit Profile
          </Button>
        ) : (
          <Button
            w={"full"}
            p={1}
            border={"0.5px solid"}
            borderColor={"gray.light"}
            h={"35px"}
            bg={"white"}
            color={"black"}
            style={{ fontSize: "14px", padding: "1" }}
            _hover={{ bg: "white" }}
            onClick={followUser}
          >
            {loading ? (
              <Spinner />
            ) : isFollowing === true ? (
              "Unfollow"
            ) : (
              "Follow"
            )}
          </Button>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <UpdateProfileCard onClose={onClose} />
          </ModalContent>
        </Modal>
        <Flex w={"full"}>
          <Flex
            flex={1}
            borderBottom={"1.5px solid white"}
            justifyContent={"center"}
            pb={3}
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>Threads</Text>
          </Flex>
          <Flex
            flex={1}
            borderBottom={"1px solid gray"}
            justifyContent={"center"}
            color={"gray.light"}
            pb={3}
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>Replies</Text>
          </Flex>
          <Flex
            flex={1}
            borderBottom={"1px solid gray"}
            justifyContent={"center"}
            color={"gray.light"}
            pb={3}
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>Reposts </Text>
          </Flex>
        </Flex>
      </VStack>
      {!user && (
        <Text fontSize={"3xl"} fontWeight={"bold"} textAlign={"center"} mt={4}>
          This account doesn’t exist
        </Text>
      )}
    </div>
  );
};

export default UserHeader;
