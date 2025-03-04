import { signIn, signUP, requestPasswordReset, resetPassword } from "../../controllers/Auth/auth.controller.js";
import { Router } from "express";

const authRouter = Router();

// Route to create a new user
authRouter.post("/signup", signUP);
// Route to sign in a user
authRouter.post("/signin", signIn);

// Route to request a password reset
authRouter.post("/forgot-password", requestPasswordReset);

// Route to reset the password using the reset token
authRouter.post("/reset-password", resetPassword);

export default authRouter;
