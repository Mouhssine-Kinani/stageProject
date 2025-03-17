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
  hasRole(["admin", "superadmin"]),
  insertProduct
);

// Récupérer tous les produits (accessible à tous)
productRoute.get('/products', 
  isAuthenticated,
  showProducts);

// Statistiques sur les produits (accessible à tous)
productRoute.get('/products/stats', 
  isAuthenticated,
  countProducts);

// Suppression d'un produit (seulement pour admin et superadmin)
productRoute.delete(
  '/products/delete/:id',
  isAuthenticated,
  hasRole(["admin", "superadmin"]),
  deleteProduct
);

// Afficher la page d'édition d'un produit (seulement pour admin et superadmin)
productRoute.get(
  '/products/edit/:id',
  isAuthenticated,
  hasRole(["admin", "superadmin"]),
  showEditProductPage
);

// Mise à jour d'un produit (seulement pour admin et superadmin)
productRoute.put(
  '/products/edit/:id',
  isAuthenticated,
  hasRole(["admin", "superadmin"]),
  editProduct
);

export default productRoute;
