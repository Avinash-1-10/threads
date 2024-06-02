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
import SearchPage from "./pages/SearchPage";
import RepostPage from "./pages/RepostPage";
import PollPage from "./pages/PollPage";
import GoogleAuth from "./pages/GoogleAuth";
import SettingsPage from "./pages/SettingsPage";
import ChangePassword from "./pages/settingPages/ChangePassword";
import DeleteAccount from "./pages/settingPages/DeleteAccount";
import FreezeAccount from "./pages/settingPages/FreezeAccount";
import ChangeTheme from "./pages/settingPages/ChangeTheme";
import MembershipSelection from "./pages/settingPages/MembershipSelection";
import Dasboard from "./pages/Dasboard";

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
          <Route path="/auth/google/callback" element={<GoogleAuth />} />
          <Route
            path="/:username"
            element={user ? <UserPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/search"
            element={user ? <SearchPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/:username/post/:pid"
            element={user ? <PostPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/:username/repost/:pid"
            element={user ? <RepostPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/:username/poll/:pid"
            element={user ? <PollPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to={"/auth"} />}
          />

          <Route
            path="/settings/change-password"
            element={user ? <ChangePassword /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/settings/delete-account"
            element={user ? <DeleteAccount /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/settings/freeze-account"
            element={user ? <FreezeAccount /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/settings/theme"
            element={user ? <ChangeTheme /> : <Navigate to={"/auth"} />}
          />
          
          <Route
            path="/settings/memberships"
            element={user ? <MembershipSelection /> : <Navigate to={"/auth"} />}
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={user ? <Dasboard /> : <Navigate to={"/auth"} />}
          />
        </Routes>
        
      </Container>

      {!showFullHeader && !isAuthPage && <Footer />}
    </Center>
  );
};

export default App;
