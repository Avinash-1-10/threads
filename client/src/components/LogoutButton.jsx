import { Box, Button, Flex } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";

const LogoutButton = () => {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/v1/user/logout");
      localStorage.removeItem("threads-user");
      localStorage.removeItem("threadsToken");
      setUser(null);
      showToast("Success", data.message, "success");
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    }
  };
  return (
    <Box
      bg={"red.500"}
      _hover={{ bg: "red.400" }}
      transition={"background-color 0.3s ease-in-out"}
      p={2}
      rounded={"md"}
      textAlign={"center"}
      fontWeight={"bold"}
      w={"full"}
      onClick={handleLogout}
    >
      Logout
    </Box>
  );
};

export default LogoutButton;
