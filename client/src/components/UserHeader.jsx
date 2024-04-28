import React from "react";
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
  Toast,
  useToast,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import useShowToast from "../hooks/useShowToast";
import UpdateProfileCard from "./UpdateProfileCard";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const UserHeader = () => {
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useRecoilValue(userAtom)
  // console.log(user)
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast("Success", "Profile link copied.", "success");
    });
  };
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
                bg={"gray.dark"}
                color={"gray.light"}
                p={1}
                borderRadius={"full"}
              >
                threads.net
              </Text>
            </Flex>
          </Box>
          <Box>
            <Avatar
              name="Mark Zukerberg"
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
            <Text color={"gray.light"}>3.2K Followers</Text>
            <Box w={1} h={1} bg={"gray"} borderRadius={"full"}></Box>
            <Link color={"gray.light"}>instagram.com</Link>
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
    </div>
  );
};

export default UserHeader;
