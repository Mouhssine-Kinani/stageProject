import { Router } from 'express';
import upload from '../middleware/upload.middleware.js'; 
import {
  insertProduct,
  showProducts,
  deleteProduct,
  showEditProductPage,
  editProduct,
} from '../../controllers/products/products.controller.js';

const productRoute = Router();

// Create a new product
productRoute.post('/products/create', upload.single('logo'), insertProduct);

// Get all products
productRoute.get('/products', showProducts);

// Delete a product
productRoute.delete('/products/delete/:id', deleteProduct);

// Show the edit page for a product
productRoute.get('/products/edit/:id', showEditProductPage);

// Update a product
productRoute.put('/products/edit/:id', editProduct);

export default productRoute;