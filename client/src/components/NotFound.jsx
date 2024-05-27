import { Img, Stack, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import notfound from "../assets/notfound.svg";

const NotFound = ({ text }) => {
  const { colorMode } = useColorMode();
  return (
    <Stack justifyContent={"center"} alignItems={"center"} h={"70vh"}>
      <Img src={notfound} />
      <Text
        fontWeight={"bold"}
        fontSize={"3xl"}
        color={colorMode === "dark" ? "white" : "black"}
        mt={5}
      >
        {text} Not Found
      </Text>
    </Stack>
  );
};

export default NotFound;
