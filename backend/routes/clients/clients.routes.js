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
  addProductToClient,
  getProductsReferencedByClients,
} from "../../controllers/clients/clients.controller.js";
import upload from "../../middleware/upload.middleware.js";
import { verifyRole, verifyToken } from "../../middleware/auth.middleware.js";

const clientRoute = Router();

// Création d'un client (seulement pour admin et superadmin)
clientRoute.post(
  "/clients/create",
  verifyToken,
  verifyRole(["Admin", "Super Admin"]),
  upload.single("logo"),
  createClient
);

// Récupérer tous les clients (accessible à tous)
clientRoute.get("/clients", verifyToken, getAllClients);

// Récupérer le nombre de clients (accessible à tous)
clientRoute.get("/clients/count", verifyToken, getClientsCount);

// Récupérer un client par son id (accessible à tous)
clientRoute.get("/clients/:id", verifyToken, getClientById);

// Suppression d'un client (seulement pour admin et superadmin)
clientRoute.delete(
  "/clients/delete/:id",
  verifyToken,
  verifyRole(["Admin", "Super Admin"]),
  deleteClient
);

// Afficher la page d'édition d'un client (seulement pour admin et superadmin)
clientRoute.get(
  "/clients/edit/:id",
  verifyToken,
  verifyRole(["Admin", "Super Admin"]),
  showEditClientPage
);

// Mise à jour d'un client (seulement pour admin et superadmin)
clientRoute.put(
  "/clients/edit/:id",
  verifyToken,
  verifyRole(["Admin", "Super Admin"]),
  upload.single("logo"),
  updateClient
);

// Suppression d'un produit d'un client (seulement pour admin et superadmin)
clientRoute.delete(
  "/clients/:clientId/product/:productId",
  verifyToken,
  verifyRole(["Admin", "Super Admin"]),
  deleteProductFromClient
);

// Ajout d'un produit à un client (seulement pour admin et superadmin)
clientRoute.post(
  "/clients/:clientId/product",
  verifyToken,
  verifyRole(["Admin", "Super Admin"]),
  addProductToClient
);

// Récupérer tous les produits référencés par des clients
clientRoute.get(
  "/clients/products/all",
  verifyToken,
  getProductsReferencedByClients
);

export default clientRoute;
