import express from 'express';
export const userRoutes = express.Router();
import { userRegister } from '../controllers/userControllers/userRegister.js';

userRoutes.post('/register', userRegister);

