import {Router} from 'express';
import { getUsers,getUser } from '../../controllers/Users/user.controller.js';

const userRouter = Router();

// Route to fetch all users
userRouter.get('/', getUsers);  

// Route to fetch a single user
userRouter.get('/:id', getUser);

// POST / users -> create a new user
userRouter.post("/",(req,res)=> res.send({title : "CREATE new user"}));

// PUT / users -> update user profile
userRouter.put("/:id",(req,res)=> res.send({title : "UPDATE user"}));

// DELETE / users -> delete user profile
userRouter.delete("/:id",(req,res)=> res.send({title : "DELETE user"}));

export default userRouter;
