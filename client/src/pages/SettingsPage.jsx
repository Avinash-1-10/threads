import React from "react";
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  Divider,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  IoKeyOutline,
  IoCardOutline,
  IoSnowOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { IoIosColorPalette } from "react-icons/io";
import { color } from "framer-motion";

const settingsOptions = [
  {
    label: "Change Password",
    icon: IoKeyOutline,
    link: "/settings/change-password",
    color: "orange.500",
  },
  {
    label: "Memberships",
    icon: IoCardOutline,
    link: "/settings/memberships",
    color: "green.500",
  },
  {
    label: "Change Theme",
    icon: IoIosColorPalette,
    link: "/settings/theme",
    color: "blue.500",
  },
  {
    label: "Freeze Account",
    icon: IoSnowOutline,
    link: "/settings/freeze-account",
    color: "yellow.500",
  },
  {
    label: "Delete Account",
    icon: IoTrashOutline,
    link: "/settings/delete-account",
    color: "red.500",
  },
];

const SettingsPage = () => {
  return (
    <Box padding="4">
      <Heading as="h2" size="lg" mb="6" textAlign={"center"}>
        Settings
      </Heading>
      <List spacing={3}>
        {settingsOptions.map((option, idx) => (
          <ListItem key={idx}>
            <Link to={option.link}>
              <Flex alignItems="center" gap={2}>
                <Icon as={option.icon} color={option.color} h={5} w={5} />
                <Text>{option.label}</Text>
              </Flex>
            </Link>
            {idx < settingsOptions.length - 1 && <Divider mt="3" />}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SettingsPage;
