import { Router } from "express";
import upload from '../../middleware/upload.middleware.js';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/Users/user.controller.js";
import { hasRole, isAuthenticated } from "../../middleware/auth.middleware.js";

const userRouter = Router();

// Route pour récupérer tous les utilisateurs (accessible à tous)
userRouter.get("/",
  isAuthenticated,
   getUsers);

// Route pour récupérer un utilisateur (accessible à tous)
userRouter.get("/:id", isAuthenticated, getUser);

// Création d'un utilisateur (seulement pour admin et superadmin)
userRouter.post(
  "/create",
  isAuthenticated,
  hasRole(["Admin", "Super Admin"]),
  upload.single('logo'),
  createUser
);

// Mise à jour d'un utilisateur (seulement pour admin et superadmin)
userRouter.put(
  "/:id",
  isAuthenticated,
  hasRole(["Admin", "Super Admin"]),
  updateUser
);

// Suppression d'un utilisateur (seulement pour admin et superadmin)
userRouter.delete(
  "/:id",
  isAuthenticated,
  hasRole(["Admin", "Super Admin"]),
  deleteUser
);

export default userRouter;
