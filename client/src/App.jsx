import { Center, Container, useBreakpointValue } from "@chakra-ui/react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import React from "react";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import LogoutButton from "./components/LogoutButton";

const App = () => {
  const location = useLocation();
  const showFullHeader = useBreakpointValue({ base: false, md: true });
  const isAuthPage = location.pathname === "/auth";
  const user = useRecoilValue(userAtom);

  return (
    <Center flexDirection={"column"}>
      {!isAuthPage && <Header />}
      <Container maxWidth="620px" mt={showFullHeader ? "90px" : "80px"}>
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to={"/"} />}
          />
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:pid" element={<PostPage />} />
        </Routes>
      </Container>

      {!showFullHeader && !isAuthPage && <Footer />}
    </Center>
  );
};

export default App;
