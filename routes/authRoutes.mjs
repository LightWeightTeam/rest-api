import express from 'express';
const authrouter = express.Router();
import authController from '../controllers/authController.mjs';

//Registrieren
authrouter.post('/register', authController.register);

//Login
authrouter.post('/login', authController.login);

//Passwort Zurücksetzen
authrouter.post('/resetPassword', authController.resetPassword);



export default authrouter;

