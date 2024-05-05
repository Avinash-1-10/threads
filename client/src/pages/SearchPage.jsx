import { Box, Button, Flex, Input, Stack, useColorMode } from "@chakra-ui/react";
import React from "react";
import SearchCard from "../components/SearchCard";

const SearchPage = () => {
    const { colorMode } = useColorMode();
  return (
    <Stack>
      <Flex gap={2}>
        <Input placeholder={"Search"} type={"text"} autoFocus />
        <Button
          bg={colorMode === "dark" ? "white" : "gray.dark"}
          color={colorMode === "dark" ? "gray.dark" : "white"}
          sx={{ ":hover": { bg: colorMode === "dark" ? "white" : "gray.800" } }}
        >
          Search
        </Button>
      </Flex>
      <Stack mt={5} gap={5}>
        {[1, 2, 3].map((_, i) => (
          <SearchCard key={i} />
        ))}
      </Stack>
    </Stack>
  );
};

export default SearchPage;
