import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SearchCard from "../components/SearchCard";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";

const SearchPage = () => {
  const { colorMode } = useColorMode();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const showToast = useShowToast();

  const getUsers = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.get(`/api/v1/user/search?query=${search}`);
      setUsers(data.data);
    } catch (error) {
      showToast(
        "Error",
        error?.response?.data?.message || error.message,
        "error"
      );
    }
  };

  return (
    <Stack>
      <form style={{ display: "flex", gap:5 }} onSubmit={getUsers}>
        <Input
          placeholder={"Search"}
          type={"text"}
          autoFocus
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          size={"sm"}
          my={"auto"}
          bg={colorMode === "dark" ? "white" : "gray.dark"}
          color={colorMode === "dark" ? "gray.dark" : "white"}
          sx={{ ":hover": { bg: colorMode === "dark" ? "white" : "gray.800" } }}
          type="submit"
        >
          Search
        </Button>
      </form>
      <Stack mt={5} gap={5}>
        {users.map((user, i) => (
          <SearchCard key={i} user={user} />
        ))}
      </Stack>
    </Stack>
  );
};

export default SearchPage;
