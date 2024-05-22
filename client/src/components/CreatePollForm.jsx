// src/components/CreatePollForm.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";

const CreatePollForm = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (options.length < 2 || options.length > 5) {
      toast({
        title: "Error",
        description: "Poll must have between 2 and 5 options.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/polls/create",
        {
          question,
          options,
        }
      );

      toast({
        title: "Poll created.",
        description: "Your poll has been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setQuestion("");
      setOptions(["", ""]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create poll.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius={"md"}
      bg={colorMode === "dark" ? "gray.dark" : "white"}
      color={colorMode === "dark" ? "white" : "black"}
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl id="question" isRequired>
            <FormLabel>Question</FormLabel>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </FormControl>

          {options.map((option, index) => (
            <FormControl key={index} id={`option-${index}`} isRequired>
              <FormLabel>Option {index + 1}</FormLabel>
              <Flex alignItems={"center"} gap={2}>
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                {options.length > 2 && (
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => removeOption(index)}
                  >
                    <MdDeleteOutline />
                  </Button>
                )}
              </Flex>
            </FormControl>
          ))}

          {options.length < 5 && (
            <Button mt={4} onClick={addOption}>
              Add Option
            </Button>
          )}

          <Button mt={4} colorScheme="teal" type="submit">
            Create Poll
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreatePollForm;
