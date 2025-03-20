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

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`[Auth] Tentative de connexion pour: ${email}`);

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[Auth] Utilisateur introuvable: ${email}`);
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`[Auth] Mot de passe incorrect pour: ${email}`);
      return res
        .status(401)
        .json({ success: false, message: "Mot de passe incorrect" });
    }

    // Générer un token JWT avec l'ID utilisateur et le rôle
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role.roleName, // Inclure le nom du rôle dans le token
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`[Auth] Génération du token pour l'utilisateur: ${user._id}`);
    console.log(
      `[Auth] Utilisateur connecté: ${JSON.stringify({
        _id: user._id,
        email: user.email,
        role: user.role.roleName,
      })}`
    );

    // Options pour les cookies
    const cookieOptions = {
      httpOnly: false, // Client peut accéder au cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      path: "/",
    };

    console.log(
      `[Auth] Production mode: ${process.env.NODE_ENV === "production"}`
    );
    console.log(`[Auth] Cookie domain: ${process.env.COOKIE_DOMAIN}`);
    console.log(`[Auth] Cookie options: ${JSON.stringify(cookieOptions)}`);

    // Définir les cookies
    res.cookie("token", token, cookieOptions);
    res.cookie("userId", user._id.toString(), cookieOptions);

    // Réponse avec succès, token et données utilisateur (sans mot de passe)
    const userToReturn = { ...user.toObject() };
    delete userToReturn.password;

    res.status(200).json({
      success: true,
      token,
      user: userToReturn,
    });
  } catch (error) {
    console.error(`[Auth] Erreur de connexion:`, error);
    res.status(500).json({ success: false, message: "Erreur du serveur" });
  }
};

export const logout = (req, res) => {
  try {
    // Options complètes pour les cookies, identiques à celles utilisées lors de la création
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
      "[Logout] Clearing cookies with options:",
      JSON.stringify(cookieOptions)
    );

    // Supprimer les cookies d'authentification
    res.clearCookie("token", cookieOptions);
    res.clearCookie("userId", cookieOptions);

    res.status(200).json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    console.error("[Logout] Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur lors de la déconnexion" });
  }
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
    res.status(500).json({
      message: "An error occurred while resetting your password",
    });
  }
};
