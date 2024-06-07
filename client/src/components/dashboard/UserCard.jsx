import { Avatar, Flex, Image, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserCard = () => {

  const [user, setUser] = useState({});
  const getUser = async () => {
    try {
      const { data } = await axios.get("/api/v1/dashboard/user");
      setUser(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <Flex gap={10} borderBottom={"1px"} borderColor={"gray.light"} p={3} mb={5}>
      <Stack justify={"center"} align={"center"}>
        <Avatar
          size={"2xl"}
          src={user?.user?.avatar}
          name={user?.user?.name}
        />
        <Text fontSize={"sm"} color={"gray.500"} mt={-2}>
        @{user?.user?.username}
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
            {user?.postCount}
          </Text>
          <Text color={"gray.500"} mt={-2} textAlign={"center"}>
            Posts
          </Text>
        </Stack>
        <Stack>
          <Text fontWeight={"bold"} fontSize={"5xl"} textAlign={"center"}>
            {user?.followersCount}
          </Text>
          <Text color={"gray.500"} mt={-2} textAlign={"center"}>
            Followers
          </Text>
        </Stack>
        <Stack>
          <Text fontWeight={"bold"} fontSize={"5xl"} textAlign={"center"}>
            {user?.followingCount}
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
