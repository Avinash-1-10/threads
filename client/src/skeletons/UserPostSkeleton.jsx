import React from "react";
import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";

const UserPostSkeleton = () => {
  return (
    <Box padding="6" boxShadow="lg" borderRadius="md">
      <Stack spacing="6">
        <Flex alignItems="center">
          <SkeletonCircle size="16" />
          <Flex ml="4" flex="1" justifyContent={"space-between"}>
            <Skeleton height="15px" width="50%" />
            <Skeleton height="15px" width="10%" />
          </Flex>
        </Flex>
        <SkeletonText/>
        <Skeleton height="300px" />
        <Flex gap={5}>
          <Skeleton height="25px" width="25px" />
          <Skeleton height="25px" width="25px" />
          <Skeleton height="25px" width="25px" />
          <Skeleton height="25px" width="25px" />
        </Flex>
        <Flex flex="1" gap={5}>
          <Skeleton height="15px" width="10%" />
          <Skeleton height="15px" width="10%" />
        </Flex>
      </Stack>
    </Box>
  );
};

export default UserPostSkeleton;
