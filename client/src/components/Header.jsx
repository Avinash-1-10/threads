import { Flex, useColorMode } from "@chakra-ui/react";
import React from "react";
import { FaThreads } from "react-icons/fa6";

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode(); // Destructuring colorMode and toggleColorMode
    return (
        <Flex justifyContent="center" mt={6} mb={12}>
            <FaThreads style={{ color: colorMode === "dark" ? "white" : "black", fontSize:"30px", cursor:"pointer" }} onClick={toggleColorMode} /> {/* Fixed the style object */}
        </Flex>
    );
};

export default Header;
