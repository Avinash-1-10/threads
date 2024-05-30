import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import useShowToast from "../../hooks/useShowToast";
import axios from "axios";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Error", "Passwords do not match", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Error", "Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.put("/api/v1/user/change-password", {
        oldPassword,
        newPassword,
      });
      showToast("Success", data.message, "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showToast("Error", error.response?.data.message, "error");
    } finally{
        setLoading(false)
    }
  };

  const lightTextColor = useColorModeValue("black", "white");
  const lightBgColor = useColorModeValue("gray.100", "gray.dark");

  return (
    <Box
      width="full"
      maxW="md"
      mx="auto"
      mt={8}
      p={4}
      bgColor={lightBgColor}
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading as="h2" size="md" textAlign="center">
        Change Password
      </Heading>
      <VStack spacing={4} mt={4}>
        <FormControl isRequired>
          <FormLabel htmlFor="oldPassword">Old Password</FormLabel>
          <Input
            id="oldPassword"
            type={showPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your current password"
            required
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="newPassword">New Password</FormLabel>
          <InputGroup size="md">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
            <InputRightElement width="4.5rem">
              <IconButton
                size="sm"
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={handleShowPassword}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" onClick={handleSubmit} width={"100%"} mt={4}>
          {
            loading ? <Spinner/> : "Change Password"
          }
        </Button>
      </VStack>
    </Box>
  );
};

export default ChangePassword;
