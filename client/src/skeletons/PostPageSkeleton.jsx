import { Flex, Skeleton, SkeletonCircle, Stack } from "@chakra-ui/react";
import React from "react";
import UserPostSkeleton from "./UserPostSkeleton";

const PostPageSkeleton = () => {
  return (
    <Stack>
      <UserPostSkeleton />
      <Skeleton height="30px" width="100%" />
      <Flex alignItems="center" mt={5}>
        <SkeletonCircle size="10" />
        <Flex ml="4" flex="1" justifyContent={"space-between"}>
          <Skeleton height="15px" width="50%" />
          <Skeleton height="15px" width="10%" />
        </Flex>
      </Flex>
    </Stack>
  );
};

export default PostPageSkeleton;
