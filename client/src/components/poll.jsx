import React, { useState } from "react";
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
  useColorMode,
  MenuItem,
} from "@chakra-ui/react";
import { MdHowToVote } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";

const Poll = () => {
  const showToast = useShowToast();
  const [poll, setPoll] = useState({
    question: "What is your favorite programming language?",
    options: [
      { _id: "1", text: "JavaScript" },
      { _id: "2", text: "Python" },
      { _id: "3", text: "Java" },
      { _id: "4", text: "C++" },
    ],
    votes: [
      { _id: "1", voteCount: 100 },
      { _id: "2", voteCount: 15 },
      { _id: "3", voteCount: 5 },
      { _id: "4", voteCount: 3 },
    ],
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useToast();

 



  const deletePoll = () => {};

  const handleVote = (optionId) => {
    if (hasVoted) return;

    setPoll((prevPoll) => {
      const updatedVotes = prevPoll.votes.map((vote) =>
        vote._id === optionId
          ? { ...vote, voteCount: vote.voteCount + 1 }
          : vote
      );
      return { ...prevPoll, votes: updatedVotes };
    });

    setHasVoted(true);
    toast({
      title: "Vote cast.",
      description: "Your vote has been recorded.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const totalVotes = poll.votes.reduce((acc, vote) => acc + vote.voteCount, 0);

  return (
    <Box>
      <Flex justifyContent={"space-between"}>
        <Flex gap={3}>
          <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
          <Text fontSize={"md"} fontWeight={"bold"} mt={2}>
            Dan Abramov
          </Text>
          <Text mt={2}>20/12/24</Text>
        </Flex>
        <Box mt={2} onClick={(e) => e.preventDefault()}>
          <Menu>
            <MenuButton>
              <BsThreeDots onClick={(e) => e.preventDefault()} />
            </MenuButton>
            <Portal>
              <MenuList bg={colorMode === "dark" ? "gray.dark" : "white"}>
                {true && (
                  <MenuItem
                    color={"red"}
                    onClick={deletePoll}
                    bg={colorMode === "dark" ? "gray.dark" : "white"}
                  >
                    Delete
                  </MenuItem>
                )}
                <MenuItem bg={colorMode === "dark" ? "gray.dark" : "white"}>
                  View
                </MenuItem>
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
          const voteCount =
            poll.votes.find((v) => v._id === option._id)?.voteCount || 0;
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
                  colorScheme="teal"
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
