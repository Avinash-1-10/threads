import { Flex, Skeleton, SkeletonCircle, Stack } from "@chakra-ui/react";
import React from "react";
import UserPostSkeleton from "./UserPostSkeleton";

const PostPageSkeleton = () => {
  return (
    <Stack>
      <UserPostSkeleton />
      <Skeleton height="30px" width="100%" />
      {
        [1,2,3].map((i) => (
            <Flex alignItems="center" mt={5} key={i}>
            <SkeletonCircle size="10" />
            <Flex ml="4" flex="1" justifyContent={"space-between"}>
              <Skeleton height="15px" width="50%" />
              <Skeleton height="15px" width="10%" />
            </Flex>
          </Flex>
        ))
      }
    </Stack>
  );
};

export default PostPageSkeleton;
