import { Router } from 'express';
import upload from '../../middleware/upload.middleware.js';
import { hasRole, isAuthenticated } from "../../middleware/auth.middleware.js";
import {
  insertProduct,
  showProducts,
  deleteProduct,
  showEditProductPage,
  editProduct,
  countProducts
} from '../../controllers/products/products.controller.js';

const productRoute = Router();

// Création d'un produit (seulement pour admin et superadmin)
productRoute.post(
  '/products/create',
  isAuthenticated,
  hasRole(["Admin", "Super Admin"]),
  insertProduct
);

// Récupérer tous les produits (accessible à tous)
productRoute.get('/products', showProducts);

// Statistiques sur les produits (accessible à tous)
productRoute.get('/products/stats', countProducts);

// Suppression d'un produit (seulement pour admin et superadmin)
productRoute.delete(
  '/products/delete/:id',
  isAuthenticated,
  hasRole(["Admin", "Super Admin"]),
  deleteProduct
);

// Afficher la page d'édition d'un produit (seulement pour admin et superadmin)
productRoute.get(
  '/products/edit/:id',
  isAuthenticated,
  hasRole(["Admin", "Super Admin"]),
  showEditProductPage
);

// Mise à jour d'un produit (seulement pour admin et superadmin)
productRoute.put(
  '/products/edit/:id',
  isAuthenticated,
  hasRole(["Admin", "Super Admin"]),
  editProduct
);

export default productRoute;
