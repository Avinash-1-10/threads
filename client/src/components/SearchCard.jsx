import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const SearchCard = ({ user }) => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      justifyContent={"space-between"}
      gap={5}
      border={"1px solid"}
      borderColor={colorMode === "dark" ? "gray.dark" : "#d1cfcf"}
      rounded={"md"}
      p={3}
    >
      <Avatar size={"md"} src={user.avatar} />
      <Box mr={"auto"}>
        <Text fontWeight={"bold"}>{user.name}</Text>
        <Text>@{user.username}</Text>
      </Box>
      <Link to={`/${user.username}`}>
      <Button
        my={"auto"}
        size={"sm"}
        bg={colorMode === "dark" ? "white" : "gray.dark"}
        color={colorMode === "dark" ? "gray.dark" : "white"}
        sx={{ ":hover": { bg: colorMode === "dark" ? "white" : "gray.800" } }}
      >
        View
      </Button>
      </Link>
    </Flex>
  );
};

export default SearchCard;
