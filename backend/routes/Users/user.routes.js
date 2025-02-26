import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/Users/user.controller.js";

const userRouter = Router();

// Route to fetch all users
userRouter.get("/", getUsers);

// Route to fetch a single user
userRouter.get("/:id", getUser);

// POST / users -> create a new user
userRouter.post("/", createUser);

// PUT / users -> update user profile
userRouter.put("/:id", updateUser);

// DELETE / users -> delete user profile
userRouter.delete("/:id", deleteUser);

export default userRouter;
