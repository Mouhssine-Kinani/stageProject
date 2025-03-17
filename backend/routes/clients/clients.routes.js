import { Router } from "express";
import {
  createClient,
  getAllClients,
  deleteClient,
  updateClient,
  getClientById,
  showEditClientPage,
  getClientsCount,
  deleteProductFromClient,
} from "../../controllers/clients/clients.controller.js";
import upload from "../../middleware/upload.middleware.js";
import { hasRole, isAuthenticated } from "../../middleware/auth.middleware.js";

const clientRoute = Router();

// Création d'un client (seulement pour admin et superadmin)
clientRoute.post(
  "/clients/create",
  isAuthenticated,
  hasRole(["admin", "superadmin"]),
  upload.single("logo"),
  createClient
);

// Récupérer tous les clients (accessible à tous)
clientRoute.get("/clients",isAuthenticated, getAllClients);

// Récupérer le nombre de clients (accessible à tous)
clientRoute.get("/clients/count", isAuthenticated, getClientsCount);

// Récupérer un client par son id (accessible à tous)
clientRoute.get("/clients/:id", isAuthenticated, getClientById);

// Suppression d'un client (seulement pour admin et superadmin)
clientRoute.delete(
  "/clients/delete/:id",
  isAuthenticated,
  hasRole(["admin", "superadmin"]),
  deleteClient
);

// Afficher la page d'édition d'un client (seulement pour admin et superadmin)
clientRoute.get(
  "/clients/edit/:id",
  isAuthenticated,
  hasRole(["admin", "superadmin"]),
  showEditClientPage
);

// Mise à jour d'un client (seulement pour admin et superadmin)
clientRoute.put(
  "/clients/edit/:id",
  isAuthenticated,
  hasRole(["admin", "superadmin"]),
  updateClient
);

// Suppression d'un produit d'un client (seulement pour admin et superadmin)
clientRoute.delete(
  "/clients/:clientId/product/:productId",
  isAuthenticated,
  hasRole(["admin", "superadmin"]),
  deleteProductFromClient
);

export default clientRoute;
