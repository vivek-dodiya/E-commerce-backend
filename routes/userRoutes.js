import express from 'express';
export const userRoutes = express.Router();
import { userRegister } from '../controllers/userControllers/userRegister.js';
import { userLogin } from '../controllers/userControllers/userLogin.js';
import { verifyOTP } from '../controllers/userControllers/verifyOTP.js';

userRoutes.post('/register', userRegister);
userRoutes.post('/login', userLogin);
userRoutes.post('/verify-otp', verifyOTP)
