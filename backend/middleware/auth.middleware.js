import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

// Middleware pour vérifier si l'utilisateur est connecté
export const isAuthenticated = (req, res, next) => {
  // Essayer de récupérer le token de différentes sources
  let token;

  // 1. Vérifier dans l'en-tête Authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Si pas de token dans l'en-tête, vérifier dans les cookies
  if (!token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Non autorisé - Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erreur de vérification du token:", error.message);
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

export const hasRole = (roles) => (req, res, next) => {
  const userRole = req.user?.role?.roleName; // Accès correct au rôle
  console.log("User role in middleware:", userRole);

  if (!userRole || !roles.includes(userRole)) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
};
