// components/DeleteAccount.js
import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import BackButton from '../components/BackButton';
import useShowToast from '../hooks/useShowToast';

const ForgotPassword = () => {
  const { colorMode } = useColorMode();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const showToast = useShowToast();

  const handleForgotPassowrd = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    setError('');
  };

  return (
    <>
    <BackButton/>
    <Container centerContent py={8}>
      <Box
        bg={useColorModeValue('white', 'gray.dark')}
        p={8}
        borderRadius="md"
        boxShadow="lg"
        w="full"
        maxW="md"
      >
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Forgot Password
        </Heading>
        <FormControl isInvalid={!!error} mb={4}>
          <FormLabel htmlFor="password">Email</FormLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="green"
          w="full"
          onClick={handleForgotPassowrd}
          mb={4}
        >
          Send Reset Link
        </Button>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          You will receive an email with a link to reset your password.
        </Text>
      </Box>
    </Container>
    </>
  );
};

export default ForgotPassword;
