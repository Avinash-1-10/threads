// components/MembershipSelection.js
import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import BackButton from "../../components/BackButton";

const memberships = [
  {
    name: "Basic",
    price: "Free",
    features: [
      "Access to basic features",
      "Community support",
      "Limited access to resources",
    ],
  },
  {
    name: "Standard",
    price: "$9.99/month",
    features: [
      "Access to all basic features",
      "Priority support",
      "Access to exclusive resources",
    ],
  },
  {
    name: "Premium",
    price: "$19.99/month",
    features: [
      "Access to all features",
      "24/7 support",
      "Unlimited access to resources",
      "Free updates and new features",
    ],
  },
];

const MembershipCard = ({ name, price, features }) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.dark")}
      p={8}
      borderRadius="md"
      boxShadow="lg"
      w="100%"
      maxW="sm"
      textAlign="center"
      transition="transform 0.3s"
      _hover={{ transform: "scale(1.05)" }}
    >
      <Heading as="h3" size="lg" mb={4}>
        {name}
      </Heading>
      <Text fontSize="2xl" mb={4}>
        {price}
      </Text>
      <VStack spacing={3} mb={6} alignItems="flex-start">
        {features.map((feature, index) => (
          <HStack key={index} spacing={2}>
            <Icon as={CheckCircleIcon} color="green.500" />
            <Text>{feature}</Text>
          </HStack>
        ))}
      </VStack>
      <Button colorScheme="teal" w="full" size="lg">
        Select
      </Button>
    </Box>
  );
};

const MembershipSelection = () => {
  return (
    <>
    <Box position={"fixed"}>
    <BackButton/>
    </Box>
    <Container centerContent py={12}>
      <Heading as="h1" size="lg" mb={12} textAlign="center">
        Select Your Membership
      </Heading>
      <Stack gap={6}>
        {memberships.map((membership) => (
          <MembershipCard key={membership.name} {...membership} />
        ))}
      </Stack>
    </Container>
    </>
  );
};

export default MembershipSelection;
