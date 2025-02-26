import mongoose from "mongoose";
import User from "../../models/Users/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRE_INS } from "../../config/env.js";

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
    const {email , password } = req.body;
    const user = await User.findOne({email});
    if(!user){
        const error = new Error('user not found');
        error.statusCode = 404;
        throw error;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        const error = new Error('Invalid password');
        error.statusCode = 401;
        throw error;
    }
    const token = jwt.sign({userId: user._id}, JWT_SECRET,{ expiresIn : JWT_EXPIRE_INS});
    res.status(200).json({
        message: 'User logged in successfully',
        data: {
            token: token,
            user: user
        }
    });

  } catch (error) {
    next(error);
  }     
}

