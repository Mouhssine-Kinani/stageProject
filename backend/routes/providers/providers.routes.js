import { Router } from 'express';
import {
  Insertprovider,
  showProviders,
  deleteProvider,
  editProvider,
  showEditProviderPage
} from '../../controllers/providers/providers.controller.js';
import upload from '../../middleware/upload.middleware.js';
import { verifyRole, verifyToken } from "../../middleware/auth.middleware.js";

const providerRoute = Router();

// Création d'un provider (seulement pour admin et superadmin)
providerRoute.post(
  '/providers/create',
  verifyToken,
  verifyRole(["Admin", "Super Admin"]),
  upload.single('logo'),
  Insertprovider
);

// Récupérer tous les providers (accessible à tous)
providerRoute.get('/providers',verifyToken, showProviders);

// Suppression d'un provider (seulement pour admin et superadmin)
providerRoute.delete(
  '/providers/delete/:id',
  verifyToken,
  verifyRole(["Admin", "Super Admin"]),
  deleteProvider
);

// Afficher la page d'édition (seulement pour admin et superadmin)
providerRoute.get(
  '/providers/edit/:id',
  verifyToken,
  verifyRole(["Admin", "Super Admin"]),
  showEditProviderPage
);

// Édition d'un provider (seulement pour admin et superadmin)
providerRoute.put(
  '/providers/edit/:id',
  verifyToken,
  verifyRole(["Admin", "Super Admin"]),
  editProvider
);

export default providerRoute;
