import { Avatar, Flex, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";

const UserCard = () => {
  return (
    <Flex gap={10} borderBottom={"1px"} borderColor={"gray.light"} p={3} mb={5}>
      <Stack justify={"center"} align={"center"}>
        <Avatar
          size={"2xl"}
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Text fontWeight={"bold"} fontSize={"2xl"}>
          John Doe
        </Text>
        <Text fontSize={"sm"} color={"gray.500"} mt={-2}>
          @username
        </Text>
      </Stack>
      <Flex
        w={"full"}
        justifyContent={"space-between"}
        align={"center"}
        mb={12}
      >
        <Stack>
          <Text fontWeight={"bold"} fontSize={"5xl"} textAlign={"center"}>
            10
          </Text>
          <Text color={"gray.500"} mt={-2} textAlign={"center"}>
            Posts
          </Text>
        </Stack>
        <Stack>
          <Text fontWeight={"bold"} fontSize={"5xl"} textAlign={"center"}>
            23K
          </Text>
          <Text color={"gray.500"} mt={-2} textAlign={"center"}>
            Followers
          </Text>
        </Stack>
        <Stack>
          <Text fontWeight={"bold"} fontSize={"5xl"} textAlign={"center"}>
            390
          </Text>
          <Text color={"gray.500"} mt={-2} textAlign={"center"}>
            Following
          </Text>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default UserCard;
