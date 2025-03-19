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

    // Création du token avec l'ID et le rôle
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
        token, // Ajout du token ici
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

// export const signIn = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         message: "Invalid password",
//         data: { email, password },
//       });
//     }

//     // Create token with user ID and role
//     const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
//       expiresIn: JWT_EXPIRE_INS,
//     });

//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: ms(JWT_EXPIRE_INS), // Convertit '1d' en millisecondes
//     });

//     res.status(200).json({
//       message: "User logged in successfully",
//       data: {
//         token, // also returned in JSON if needed
//         user: {
//           _id: user._id,
//           reference: user.reference,
//           fullName: user.fullName,
//           email: user.email,
//           role: user.role,
//           status: user.status,
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
        data: { email, password },
      });
    }

    // Create token with user ID and role
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_INS,
    });

    // Log pour débogage
    console.log("Production mode:", process.env.NODE_ENV === "production");
    console.log("Cookie domain:", process.env.COOKIE_DOMAIN || "undefined");

    // Set cookie with the correct SameSite and Secure settings
    const cookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: ms(JWT_EXPIRE_INS),
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    };

    console.log("Cookie options:", JSON.stringify(cookieOptions));

    res.cookie("token", token, cookieOptions);
    res.cookie("userId", user._id.toString(), cookieOptions);

    res.status(200).json({
      message: "User logged in successfully",
      data: {
        token, // also returned in JSON if needed
        user: {
          _id: user._id,
          reference: user.reference,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  const cookieOptions = {
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  };

  console.log(
    "Logout - clearing cookies with options:",
    JSON.stringify(cookieOptions)
  );

  res.clearCookie("token", cookieOptions);
  res.clearCookie("userId", cookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found. Veuillez réessayer.",
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
        message: `Un email de réinitialisation a déjà été envoyé. Veuillez attendre ${timeLeft} minutes avant de réessayer.`,
      });
    }

    // Generate a reset token (you can set your own expiry time)
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 360000; // Token expires in 1 hour
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
      subject: "Réinitialisation de mot de passe",
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">Réinitialiser mon mot de passe</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        const error = new Error("Error sending email");
        error.statusCode = 500;
        return res.status(500).json({
          message: "Error sending email",
        });
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

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired token",
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
    next(error);
  }
};
