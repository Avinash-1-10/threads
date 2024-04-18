import { Center, Container, useBreakpointValue } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import React from "react";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const showFullHeader = useBreakpointValue({ base: false, md: true });
  return (
    <Center flexDirection={"column"}>
      <Header />
      <Container maxWidth="620px" mt={showFullHeader ? "90px" : "75px"}>
        <Routes>
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:pid" element={<PostPage />} />
        </Routes>
      </Container>
      {!showFullHeader && <Footer />}
    </Center>
  );
};

export default App;
