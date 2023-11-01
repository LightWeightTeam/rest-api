// authRoutes.mjs
import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.mjs';

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/resetPassword', authController.resetPassword);
//router.post('/signInWithGoogle', authController.signInWithGoogle);

export default router;

