import express from "express";
import passport from "passport";
import {
  initiateGoogleAuth,
  loginFailed,
  loginSuccess,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Route to handle OAuth callback with redirection based on success or failure.
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.CALLBACK_URL}/auth/google/callback`,
    failureRedirect: "/login/failed",
  })
);

// Route to initiate Google OAuth2 login process.
router.get("/google", initiateGoogleAuth);

// Route to handle successful login and check user existence in database.
router.get("/login/success", loginSuccess);

// Route to handle failed login attempts and provide error feedback.
router.get("/login/failed", loginFailed);

export default router;
