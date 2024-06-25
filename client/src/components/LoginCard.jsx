import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Img,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import googlesvg from "../assets/google.svg";
import { NavLink } from "react-router-dom";

const LoginCard = () => {
  const showToast = useShowToast();
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://threads-ffw7.onrender.com/api/v1/user/login", formData);
      // console.log(data.data);
      localStorage.setItem("threads-user", JSON.stringify(data?.data?.user));
      localStorage.setItem("threadsToken", data.data.threadsToken);
      setUser(data?.data?.user);
      showToast("Success", data.message, "success");
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    }
  };

  const googleAuth = () => {
    window.open("https://threads-ffw7.onrender.com/auth/google/callback", "_self");
  };
  return (
    <Flex>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Log in
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <Box>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </FormControl>
            </Box>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSubmit}
              >
                Log in
              </Button>
            </Stack>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"white"}
                fontSize={"lg"}
                color={"black"}
                _hover={{
                  bg: "white",
                }}
                onClick={googleAuth}
              >
                <Img src={googlesvg} alt="google" w={"25px"} mr={2} />
                Google
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Register Now{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => setAuthScreen("signup")}
                >
                  Signup
                </Link>
              </Text>
            </Stack>
            <Stack pt={1}>
              <Text align={"center"} fontSize={"sm"} color={"blue.400"} _hover={{ color: "blue.500", textDecoration: "underline", transition: "color 0.3s ease-in-out"}}>
                <NavLink to={"/forgot-passowrd"}
                >
                  Forgot Password?
                </NavLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginCard;
