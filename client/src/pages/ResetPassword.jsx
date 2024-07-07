// components/ResetPassword.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useColorMode,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ResetPassword = () => {
  const { colorMode } = useColorMode();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const showToast = useShowToast();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleResetPassword = async () => {
    try {
      if (!password || !confirmPassword) {
        setError("Both fields are required");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setError("");

      const { data } = await axios.post(`${BACKEND_URL}/user/reset-password`, {
        password,
        token,
      });
      showToast("Success", data.message, "success");
      navigate("/login");
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    }
  };

  return (
    <>
      <BackButton />
      <Container centerContent py={8}>
        <Box
          bg={useColorModeValue("white", "gray.dark")}
          p={8}
          borderRadius="md"
          boxShadow="lg"
          w="full"
          maxW="md"
        >
          <Heading as="h2" size="lg" mb={6} textAlign="center">
            Reset Password
          </Heading>
          <FormControl isInvalid={!!error} mb={4}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl isInvalid={!!error} mb={4}>
            <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
          <Button
            colorScheme="green"
            w="full"
            onClick={handleResetPassword}
            mb={4}
          >
            Reset Password
          </Button>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            After resetting, you will be redirected to the login page.
          </Text>
        </Box>
      </Container>
    </>
  );
};

export default ResetPassword;
