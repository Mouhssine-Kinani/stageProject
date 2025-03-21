import express from "express";
import upload from "../../middleware/upload.middleware.js";
import * as userController from "../../controllers/Users/user.controller.js";
import { verifyRole, verifyToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Route pour obtenir l'utilisateur actuel (authentifié)
router.get("/me", verifyToken, async (req, res) => {
  try {
    // req.user contient déjà l'utilisateur complet grâce au middleware verifyToken
    console.log(
      `[Users] Récupération des données de l'utilisateur: ${req.user._id}`
    );

    // Renvoyer l'utilisateur sans le mot de passe
    const userToReturn = { ...req.user.toObject() };
    delete userToReturn.password;

    res.status(200).json(userToReturn);
  } catch (error) {
    console.error(
      `[Users] Erreur lors de la récupération des données utilisateur:`,
      error
    );
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des données de l'utilisateur",
    });
  }
});

// Route pour la déconnexion (mettre à jour lastLogin_date)
router.post("/logout", verifyToken, userController.logoutUser);

// Routes protégées par authentification
router.use(verifyToken);

// Routes accessibles à tous les utilisateurs authentifiés
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);

// Routes avec restrictions de rôle (Admin uniquement)
router.post(
  "/",
  verifyRole(["Admin", "Super Admin"]),
  userController.createUser
);
router.put(
  "/edit/:id",
  verifyRole(["Admin", "Super Admin"]),
  upload.single("logo"),
  userController.updateUser
);
router.delete("/:id", verifyRole(["Super Admin"]), userController.deleteUser);

export default router;
