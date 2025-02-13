import express from 'express';
export const userRoutes = express.Router();
import { userRegister } from '../controllers/userControllers/userRegister.js';
import { userLogin } from '../controllers/userControllers/userLogin.js';
import { verifyOTP } from '../controllers/userControllers/verifyOTP.js';
import { auth } from '../middlewares/authMiddleware.js';
import { userProfileUpdate } from '../controllers/userControllers/userProfileUpdate.js';
import { onlyAdminAccess } from '../middlewares/onlyAdminAccess.js';
import { userLogout } from '../controllers/userControllers/userLogout.js';

userRoutes.post('/register', userRegister);
userRoutes.post('/login', userLogin);
userRoutes.post('/logout', auth , userLogout);
userRoutes.post('/verify-otp',verifyOTP);
userRoutes.put('/profile-update', auth , userProfileUpdate);
