import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import { BsSend } from "react-icons/bs";

const SearchCard = () => {
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
      <Avatar size={"md"} />
      <Box mr={"auto"}>
        <Text fontWeight={"bold"}>John Doe</Text>
        <Text>@johndoe</Text>
      </Box>
      <Button
      my={"auto"}
      size={"sm"}
        bg={colorMode === "dark" ? "white" : "gray.dark"}
        color={colorMode === "dark" ? "gray.dark" : "white"}
        sx={{ ":hover": { bg: colorMode === "dark" ? "white" : "gray.800" } }}
      >
        View
      </Button>
    </Flex>
  );
};

export default SearchCard;
