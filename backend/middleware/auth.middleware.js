import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

// Middleware pour vérifier si l'utilisateur est connecté
export const isAuthenticated = (req, res, next) => {
  // Check token in Authorization header or cookies
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
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
