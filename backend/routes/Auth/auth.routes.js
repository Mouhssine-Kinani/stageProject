import {
  signIn,
  signUP,
  logout,
  requestPasswordReset,
  resetPassword,
  checkAuth,
} from "../../controllers/Auth/auth.controller.js";
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";

const authRouter = Router();

// Route to create a new user
authRouter.post("/signup", signUP);

// Route to sign in a user
authRouter.post("/signin", signIn);

// Route to log out a user
authRouter.get("/logout", logout);

// Route to check authentication status
authRouter.get("/check-auth", protect, checkAuth);

// Route to request a password reset
authRouter.post("/forgot-password", requestPasswordReset);

// Route to reset the password using the reset token
authRouter.post("/reset-password", resetPassword);

export default authRouter;
