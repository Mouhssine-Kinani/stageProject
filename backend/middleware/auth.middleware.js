import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

// Middleware pour vérifier si l'utilisateur est connecté
export const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // On ajoute l'utilisateur à `req`
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

export const hasRole = (roles) => (req, res, next) => {
  console.log("User in middleware:", req.user);
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
};

