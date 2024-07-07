// components/ThemeSelector.js
import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  useColorMode,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import BackButton from '../../components/BackButton';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ChangeTheme = ({ onThemeChange }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const colorOptions = [
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Red', value: 'red' },
    { name: 'Purple', value: 'purple' },
  ];

  const handleThemeSelect = (theme) => {
    onThemeChange(theme);
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
        textAlign="center"
      >
        <Heading as="h2" size="lg" mb={6}>
          Select Theme
        </Heading>
        <SimpleGrid columns={2} spacing={4}>
          {colorOptions.map((option) => (
            <Button
              key={option.value}
              colorScheme={option.value}
              onClick={() => handleThemeSelect(option.value)}
            >
              {option.name}
            </Button>
          ))}
        </SimpleGrid>
      </Box>
    </Container>
    </>
  );
};

export default ChangeTheme;
