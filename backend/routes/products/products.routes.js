import { Router } from 'express';
import upload from '../../middleware/upload.middleware.js'
import {
  insertProduct,
  showProducts,
  deleteProduct,
  showEditProductPage,
  editProduct,
} from '../../controllers/products/products.controller.js';

const productRoute = Router();

// check if i should add a route get for product creation 

// Create a new product
productRoute.post('/products/create', insertProduct);

// Get all products
productRoute.get('/products', showProducts);

// Delete a product
productRoute.delete('/products/delete/:id', deleteProduct);

// Show the edit page for a product
productRoute.get('/products/edit/:id', showEditProductPage);

// Update a product
productRoute.put('/products/edit/:id', editProduct);

export default productRoute;