import mongoose from "mongoose";
import User from "../../models/Users/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

    await newUser.save(); // Sauvegarde directe sans transaction

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_INS,
    });

    res.status(201).json({
      message: "User created successfully",
      data: {
        token: token,
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: { email, password },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_INS,
    });
    res.status(200).json({
      message: "User logged in successfully",
      data: {
        token: token,
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    // Generate a reset token (you can set your own expiry time)
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;

    await user.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });
    const resetLink = `${FRONT_END_URL}/forget/${resetToken}`;
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Please use the following link to reset your password: ${resetLink}`,
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
    const user = await User.findOne({ resetToken });

    if (!user || user.resetTokenExpiry < Date.now()) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 400;
      throw error;
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
    next(error);
  }
};
