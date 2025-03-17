import express from "express";
import { requestPasswordReset, resetPassword } from "../../controllers/Auth/auth.controller.js";

const router = express.Router();

// Request password reset (send email with reset link)
router.post("/forgot", requestPasswordReset);

// Reset password using the token
router.post("/reset-password", resetPassword);

export default router;
