import express from 'express';
export const productRoutes = express.Router();
import { auth } from '../middlewares/authMiddleware.js';
import { onlyAdminAccess } from '../middlewares/onlyAdminAccess.js';
import { createProduct } from '../controllers/productControllers/createProduct.js';
import { getAllProducts } from '../controllers/productControllers/getAllProducts.js';
import { getByCategory } from '../controllers/productControllers/getByCategory.js';
import { getByName } from '../controllers/productControllers/getByName.js';
import { getByPriceGreaterThen, getByPriceLessThen } from '../controllers/productControllers/getByPrice.js';
import { updateProduct } from '../controllers/productControllers/updateProduct.js';
import { deleteProduct } from '../controllers/productControllers/deleteProduct.js';

// only Admin Access This Routes
productRoutes.post('/create-product', auth, onlyAdminAccess, createProduct);
productRoutes.put('/update-product/:id', auth, onlyAdminAccess, updateProduct);
productRoutes.delete('/delete-product/:id', auth, onlyAdminAccess, deleteProduct);


productRoutes.get('/get-all-products', auth, getAllProducts);
productRoutes.get('/get-by-category/:category', auth, getByCategory);
productRoutes.get('/get-by-name/:name', auth, getByName);
productRoutes.get('/get-by-price/lessthen', auth, getByPriceLessThen);
productRoutes.get('/get-by-price/greaterthen', auth, getByPriceGreaterThen);