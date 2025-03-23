import mongoose from "mongoose";
import User from "../../models/Users/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms from "ms";
import {
  JWT_SECRET,
  JWT_EXPIRE_INS,
  EMAIL_PASSWORD,
  EMAIL_USER,
  FRONT_END_URL,
} from "../../config/env.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const signUP = async (req, res, next) => {
  try {
    const { reference, fullName, email, password, role, status } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("Email is already in use");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      reference,
      fullName,
      email,
      password: hashedPassword,
      role,
      status,
    });

    await newUser.save();

    // Create token with ID and role
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRE_INS,
      }
    );

    res.status(201).json({
      message: "User created successfully",
      data: {
        token, // Add token here
        user: {
          _id: newUser._id,
          reference: newUser.reference,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(`[Auth] Login attempt for email: ${email}`);

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[Auth] User not found`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check the password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`[Auth] Incorrect password`);
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate a JWT token with user ID and role
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role.roleName, // Include role name in the token
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`[Auth] Token generated for user: ${user._id}`);

    // Cookie options - for local development, don't set domain
    const isProduction = process.env.NODE_ENV === "production";
    console.log(`[Auth] Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`[Auth] Is production: ${isProduction}`);
    console.log(
      `[Auth] COOKIE_DOMAIN: ${process.env.COOKIE_DOMAIN || "not set"}`
    );

    const cookieOptions = {
      httpOnly: true, // Cookies are only accessible by the server for better security
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    };

    // Only set domain in production
    if (isProduction && process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    console.log(`[Auth] Cookie options:`, cookieOptions);

    // Set theuserId cookie
    res.cookie("userId", user._id.toString(), cookieOptions);
    console.log(`[Auth] Cookie set with userId: ${user._id}`);

    // Response with success, token as Bearer token and user data (without password)
    const userToReturn = { ...user.toObject() };
    delete userToReturn.password;

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      userId: user._id.toString(), // Also include userId in response
      user: userToReturn,
    });
  } catch (error) {
    console.error(`[Auth] Login error:`, error);
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    console.log("[Logout] Processing logout");

    // Get same production flag as signIn
    const isProduction = process.env.NODE_ENV === "production";
    console.log(
      `[Logout] Environment: ${process.env.NODE_ENV || "development"}`
    );
    console.log(`[Logout] Is production: ${isProduction}`);
    console.log(
      `[Logout] COOKIE_DOMAIN: ${process.env.COOKIE_DOMAIN || "not set"}`
    );

    // Complete cookie options, identical to those used during creation
    const cookieOptions = {
      path: "/",
      httpOnly: true, // Changed to match signin cookie options
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    };

    // Only set domain in production
    if (isProduction && process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    console.log("[Logout] Clearing cookies with options:", cookieOptions);

    // Delete only the userId cookie
    res.clearCookie("userId", cookieOptions);

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("[Logout] Error:", error);
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please try again.",
      });
    }

    // Check if user has a valid reset token
    if (
      user.resetToken &&
      user.resetTokenExpiry &&
      user.resetTokenExpiry > Date.now()
    ) {
      const timeLeft = Math.ceil(
        (user.resetTokenExpiry - Date.now()) / 1000 / 60
      ); // Convert to minutes
      return res.status(400).json({
        message: `A reset email has already been sent. Please wait ${timeLeft} minutes before trying again.`,
      });
    }

    // Generate a reset token (you can set your own expiry time)
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour (3600000 ms)
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    // Update the reset link format to match our frontend route
    const resetLink = `${FRONT_END_URL}/reset?token=${resetToken}`;

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
        <h1>Password Reset</h1>
        <p>You have requested a password reset.</p>
        <p>Click on the link below to reset your password:</p>
        <a href="${resetLink}">Reset my password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this reset, please ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        const error = new Error("Error sending email");
        error.statusCode = 500;
        return next(error);
      }
      res.status(200).json({
        message: "Password reset email sent successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        message: "Reset token and new password are required",
      });
    }

    const user = await User.findOne({ resetToken });

    if (!user) {
      return res.status(400).json({
        message: "Invalid reset token",
      });
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({
        message: "Reset token has expired",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Reset user's password and clear the reset token and expiry
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    next(error);
  }
};

// Nouvelle fonction pour vérifier l'authentification
export const checkAuth = async (req, res) => {
  try {
    // req.user est déjà chargé par le middleware protect
    console.log(
      "[CheckAuth] Vérification d'authentification pour l'utilisateur:",
      req.user._id
    );

    // Trouver l'utilisateur avec toutes ses données (sans le mot de passe)
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      console.log("[CheckAuth] Utilisateur non trouvé");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("[CheckAuth] Authentification réussie pour:", user._id);

    // Retourner le statut d'authentification et les données utilisateur
    res.status(200).json({
      success: true,
      message: "Authentication valid",
      user,
    });
  } catch (error) {
    console.error("[CheckAuth] Erreur:", error);
    res.status(500).json({
      success: false,
      message: "Authentication check failed",
      error: error.message,
    });
  }
};
