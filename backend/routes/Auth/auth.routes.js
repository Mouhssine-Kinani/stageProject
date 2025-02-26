import { signIn, signUP } from "../../controllers/Auth/auth.controller.js";

import { Router } from "express";

const authRouter = Router();

// Route to create a new user
authRouter.post("/signup", signUP);
// Route to sign in a user
authRouter.post("/signin", signIn);

export default authRouter;