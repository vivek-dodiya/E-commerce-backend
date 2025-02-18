import express from 'express';
export const userRoutes = express.Router();
import { userRegister } from '../controllers/userControllers/userRegister.js';
import { userLogin } from '../controllers/userControllers/userLogin.js';
import { verifyOTP } from '../controllers/userControllers/verifyOTP.js';
import { auth } from '../middlewares/authMiddleware.js';
import { userProfileUpdate } from '../controllers/userControllers/userProfileUpdate.js';
import { onlyAdminAccess } from '../middlewares/onlyAdminAccess.js';
import { userLogout } from '../controllers/userControllers/userLogout.js';
import { userDelete } from '../controllers/userControllers/userDelete.js';
import { getAllUsers } from '../controllers/userControllers/getAllUsers.js';
import { getUserProfile } from '../controllers/userControllers/userProfile.js';

userRoutes.get('/allusers', auth, onlyAdminAccess, getAllUsers);

userRoutes.post('/register', userRegister);
userRoutes.get('/profile', auth, getUserProfile);
userRoutes.post('/login', userLogin);
userRoutes.post('/verify-otp', verifyOTP);
userRoutes.put('/profile-update', auth, userProfileUpdate);
userRoutes.post('/logout', auth, userLogout);
userRoutes.delete('/delete', auth, userDelete);
