import React from "react";
import { VStack, Box, Flex, Avatar, Text } from "@chakra-ui/react";

const UserHeader = () => {
  return (
    <div>
      <VStack gap={4} alignItems="start">
        <Flex justifyContent={"space-between"} w={"full"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              Mark Zuckerberg
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>markzuckerberg</Text>
              <Text
                fontSize={"xs"}
                bg={"gray.dark"}
                color={"gray.light"}
                p={1}
                borderRadius={"full"}
              >
                threads.net
              </Text>
            </Flex>
          </Box>
          <Box>
            <Avatar
              name="Mark Zukerberg"
              src="https://th.bing.com/th/id/R.ea364ab89ddd4166bfb1ac5a4e4ee993?rik=W8En7A41SPBsew&riu=http%3a%2f%2fwww.thefamouspeople.com%2fprofiles%2fimages%2fmark-zuckerberg-1.jpg&ehk=fUIo77pqJt%2fgyYNzMN7cG9yoUXXLcfpQIKSK3M43LW4%3d&risl=&pid=ImgRaw&r=0"
              size={"xl"}
            />
          </Box>
        </Flex>
        <Text>Co-founder, executive chairman and CEO of Meta Platform</Text>
        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex></Flex>
          <Flex></Flex>
        </Flex>
      </VStack>
    </div>
  );
};

export default UserHeader;
