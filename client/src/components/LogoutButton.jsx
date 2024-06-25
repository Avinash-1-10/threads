import {  Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import { IoIosLogOut } from "react-icons/io";


const LogoutButton = () => {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("https://threads-ffw7.onrender.com/api/v1/user/logout");
      localStorage.removeItem("threads-user");
      localStorage.removeItem("threadsToken");
      setUser(null);
      showToast("Success", data.message, "success");
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    }
  };
  return (
    <Flex
      color={"red.500"}
      _hover={{ color: "red.600", cursor: "pointer" }}
      transition={"background-color 0.3s ease-in-out"}
      w={"full"}
      gap={2}
      onClick={handleLogout}
    >
      <IoIosLogOut size={"23px"} />
      <Text fontSize={"md"}>Logout</Text>
    </Flex>
  );
};

export default LogoutButton;
