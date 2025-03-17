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
userRouter.get("/",isAuthenticated, getUsers);

// Route pour récupérer un utilisateur (accessible à tous)
userRouter.get("/:id", isAuthenticated, getUser);

// Création d'un utilisateur (seulement pour admin et superadmin)
userRouter.post(
  "/create",
  isAuthenticated,
  hasRole(["admin", "superadmin"]),
  upload.single('logo'),
  createUser
);

// Mise à jour d'un utilisateur (seulement pour admin et superadmin)
userRouter.put(
  "/:id",
  isAuthenticated,
  hasRole(["admin", "superadmin"]),
  updateUser
);

// Suppression d'un utilisateur (seulement pour admin et superadmin)
userRouter.delete(
  "/:id",
  isAuthenticated,
  hasRole(["admin", "superadmin"]),
  deleteUser
);

export default userRouter;
