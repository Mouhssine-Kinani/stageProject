import jwt from "jsonwebtoken";
import User from "../models/Users/user.model.js";

// Middleware pour vérifier si l'utilisateur est connecté
export const verifyToken = async (req, res, next) => {
  try {
    console.log("[Auth] Vérification du token");

    // Récupérer le token depuis les headers Authorization
    let token = null;

    // Vérifier si le token est dans l'en-tête Authorization
    if (req.headers.authorization) {
      // Si le token est au format "Bearer <token>"
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
      // Si le token est envoyé directement sans préfixe
      else {
        token = req.headers.authorization;
      }
    }
    // Vérifier les autres emplacements possibles (compatibilité)
    if (!token) {
      token = req.cookies.token || req.headers["x-auth-token"];
    }

    if (!token) {
      console.log("[Auth] Pas de token trouvé");
      return res.status(401).json({
        success: false,
        message: "Accès refusé. Aucun token fourni.",
      });
    }

    try {
      // Décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("[Auth] Token décodé:", JSON.stringify(decoded));

      // Chercher l'utilisateur soit par id (nouvelle structure) soit par userId (ancienne structure)
      const userId = decoded.id || decoded.userId;
      if (!userId) {
        console.log("[Auth] ID utilisateur non trouvé dans le token:", decoded);
        return res.status(401).json({
          success: false,
          message: "Token invalide - ID utilisateur manquant",
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        console.log(
          `[Auth] Utilisateur non trouvé après décodage du token. ID: ${userId}`
        );
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Assigner l'utilisateur à la requête
      req.user = user;
      console.log(
        `[Auth] Token vérifié pour l'utilisateur: ${user.email} (${user._id})`
      );
      next();
    } catch (error) {
      console.error("[Auth] Erreur de vérification du token:", error.message);
      return res.status(401).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }
  } catch (error) {
    console.error(
      "[Auth] Erreur dans le middleware d'authentification:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

export const verifyRole = (roles) => {
  return (req, res, next) => {
    try {
      console.log(
        `[Auth] Vérification du rôle. Rôles requis: ${roles.join(", ")}`
      );

      if (!req.user) {
        console.log(
          "[Auth] Utilisateur non authentifié pour la vérification du rôle"
        );
        return res.status(401).json({
          success: false,
          message: "Authentification requise avant la vérification du rôle",
        });
      }

      // Accès au nom du rôle à partir de la structure imbriquée
      const userRole = req.user.role?.roleName;
      console.log(`[Auth] Rôle de l'utilisateur: ${userRole}`);

      if (!userRole || !roles.includes(userRole)) {
        console.log(
          `[Auth] Accès refusé. Le rôle ${userRole} n'a pas les permissions requises`
        );
        return res.status(403).json({
          success: false,
          message: "Accès interdit. Permissions insuffisantes.",
        });
      }

      console.log("[Auth] Vérification du rôle réussie");
      next();
    } catch (error) {
      console.error("Error checking permissions:", error);
      res.status(500).json({
        success: false,
        message: "Error while checking permissions",
      });
    }
  };
};
