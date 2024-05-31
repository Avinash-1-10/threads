import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IoChevronBack } from "react-icons/io5";

const BackButton = () => {
  return (
    <Flex
      alignItems={"center"}
      gap={1}
      onClick={() => window.history.back()}
      cursor="pointer"
    >
      <Icon as={IoChevronBack} h={5} w={5} />
      <Text>Back</Text>
    </Flex>
  );
};

export default BackButton;
