import { Center, Container, useBreakpointValue } from "@chakra-ui/react";
import { Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";

const App = () => {
  const location = useLocation(); // Use useLocation hook to get location object
  const showFullHeader = useBreakpointValue({ base: false, md: true });
  const isAuthPage = location.pathname === "/auth"; // Determine if the current page is AuthPage

  return (
    <Center flexDirection={"column"}>
      {!isAuthPage && <Header />}
      <Container maxWidth="620px" mt={showFullHeader ? "90px" : "80px"}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:pid" element={<PostPage />} />
        </Routes>
      </Container>
      {!showFullHeader || (!isAuthPage && <Footer />)}
    </Center>
  );
};

export default App;
