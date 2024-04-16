import { Center, Container } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import React from "react";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";

const App = () => {
  return (
    <Center>
      <Container maxWidth="620px">
        <Header />
        <Routes>
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:pid" element={<PostPage />} />
        </Routes>
      </Container>
    </Center>
  );
};

export default App;
