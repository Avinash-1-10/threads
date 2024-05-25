import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Progress,
  useToast,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  useColorMode,
} from "@chakra-ui/react";
import { MdHowToVote, MdVerified } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import useTimeAgo from "../hooks/useTimeAgo";
import userAtom from "../atoms/userAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";

const Poll = ({ pollData }) => {
  const [poll, setPoll] = useState(pollData);
  const showToast = useShowToast();
  const { colorMode } = useColorMode();
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(poll.totalVotes);
  const timeAgo = useTimeAgo(poll.createdAt);
  const owner = useRecoilValue(userAtom);

  const deletePoll = async () => {
    try {
      await axios.delete(`/api/v1/poll/${poll._id}`);
      showToast("success", "Poll deleted.", "success");
    } catch (error) {
      showToast("error", "Poll not deleted.", "error");
    }
  };

  const checkVoted = async () => {
    try {
      const { data } = await axios.get(`/api/v1/poll/check-vote/${poll._id}`);
      setHasVoted(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    checkVoted();
  }, []);

  const handleVote = async (optionId) => {
    if (hasVoted) return;
    console.log(optionId);
    // Perform vote submission logic here
    await axios
      .post(`/api/v1/poll/vote`, { pollId: poll._id, optionId })
      .then((res) => {
        console.log(res.data);
        setTotalVotes(totalVotes + 1);
        poll.options.map((option) => {
          if (option._id === optionId) {
            option.voteCount += 1;
          }
        });
        console.log(poll);
        setHasVoted(true);
        showToast("success", "Vote cast.", "success");
      })
      .catch((err) => {
        showToast("error", err.response.data.message, "error");
      });
  };

  return (
    <Box my={4}>
      <Flex justifyContent={"space-between"}>
        <Flex gap={3}>
          <Avatar name={poll.createdBy.name} src={poll.createdBy.avatar} />
          <Text fontSize={"md"} fontWeight={"bold"} mt={1}>
            {poll.createdBy.name}
          </Text>
          <Box mt={2}>
            {poll.createdBy.isVerfied && <MdVerified color="#2B96E9" />}
          </Box>
          <Text mt={1} color={"gray.light"}>
            {timeAgo}
          </Text>
        </Flex>
        <Box mt={1} onClick={(e) => e.preventDefault()}>
          <Menu>
            <MenuButton>
              <BsThreeDots onClick={(e) => e.preventDefault()} />
            </MenuButton>
            <Portal>
              <MenuList bg={colorMode === "dark" ? "gray.dark" : "white"}>
                {owner._id === poll.createdBy._id && (
                  <MenuItem
                    color={"red"}
                    onClick={deletePoll}
                    bg={colorMode === "dark" ? "gray.dark" : "white"}
                  >
                    Delete
                  </MenuItem>
                )}
                <MenuItem bg={colorMode === "dark" ? "gray.dark" : "white"}>
                  Report
                </MenuItem>
                <MenuItem bg={colorMode === "dark" ? "gray.dark" : "white"}>
                  Share
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Box>
      </Flex>
      <Text fontSize="lg" my={4}>
        {poll.question}
      </Text>
      <VStack
        spacing={4}
        align="stretch"
        border={"1px"}
        borderColor={"gray.light"}
        p={4}
        borderRadius={"md"}
      >
        {poll.options.map((option) => {
          const voteCount = option.voteCount || 0;
          const votePercentage =
            totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

          return (
            <Box key={option._id} width="100%">
              <HStack justify="space-between">
                <Flex
                  w={"full"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Text>{option.text}</Text>
                  {!hasVoted && (
                    <Button
                      mt={2}
                      size={"sm"}
                      bg={colorMode === "dark" ? "white" : "black"}
                      color={colorMode === "dark" ? "black" : "white"}
                      _hover={
                        colorMode === "dark"
                          ? { bg: "white", shadow: "md" }
                          : { bg: "black", shadow: "md" }
                      }
                      onClick={() => handleVote(option._id)}
                    >
                      Vote
                    </Button>
                  )}
                </Flex>
                {hasVoted && (
                  <Text fontSize={"sm"}>{votePercentage.toFixed(2)}%</Text>
                )}
              </HStack>
              {hasVoted && (
                <Progress
                  value={votePercentage}
                  size="sm"
                  sx={{
                    "& > div:first-of-type": {
                      bg: "linear-gradient(90deg, #4bc0c8, #c779d0, #feac5e)",
                    },
                  }}
                  bg={colorMode === "dark" ? "gray.dark" : "gray.200"}
                />
              )}
            </Box>
          );
        })}
        {hasVoted && (
          <Text color={colorMode === "dark" ? "gray.400" : "gray.500"}>
            Total Votes: {totalVotes}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default Poll;
