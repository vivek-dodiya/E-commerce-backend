import express from 'express';
export const orderRoutes = express.Router();
import { auth } from '../middlewares/authMiddleware.js';
import { placeOrder } from '../controllers/orderControllers/placeOrder.js';
import { cancleOrder } from '../controllers/orderControllers/cancleOrder.js';

orderRoutes.post('/place-order/:id', auth, placeOrder)
orderRoutes.delete('/cancle-order/:id', auth, cancleOrder)