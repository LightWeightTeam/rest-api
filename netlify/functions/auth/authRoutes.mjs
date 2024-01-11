// authRoutes.mjs (Beispiel)

import express from 'express';
import authController from './authController.mjs';

const authrouter = express.Router();

authrouter.post('/register', authController.register);
authrouter.post('/login', authController.login);
authrouter.post('/resetPassword', authController.resetPassword);

export default authrouter;
