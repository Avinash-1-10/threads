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
import BackButton from '../../components/BackButton';

const DeleteAccount = () => {
  const { colorMode } = useColorMode();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }
    setError('');

    // Add your API call logic here to delete the account
    console.log('Account deletion requested with password:', password);
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
          Delete Account
        </Heading>
        <FormControl isInvalid={!!error} mb={4}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="red"
          w="full"
          onClick={handleDeleteAccount}
          mb={4}
        >
          Delete Account
        </Button>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          This action cannot be undone.
        </Text>
      </Box>
    </Container>
    </>
  );
};

export default DeleteAccount;
