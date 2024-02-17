import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import config from '../firebaseKeys/configKey.mjs';
import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = firebase.initializeApp(config);
const adminApp = admin.app();

//generiert einen Token
const generateToken = (uid) => {
  return jwt.sign({ uid }, process.env.jwtKey, { expiresIn: '24h' });
};


// Registrieren von Usern
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const uid = user.uid;

    try {
      // Email wird in users -> uid gespeichert
      await firebase.firestore().collection('users').doc(uid).set({
        'email': email,
        'gender': "null",
        'age': 0,
        'weight': 0,
        'height': 0
      });

      // Basic_calories wird beim Erstellen des Accounts bereits erstellt in users -> uid -> nutrition -> food_values
      await firebase.firestore().collection('users').doc(uid).collection('nutrition').doc('food_values').set({
        'basic_calories': 0
      });

      const token = await generateToken(uid, email);

      console.log('Documents created');
      res.json({ uid, token, success: true });
    } catch (e) {
      console.error('Error creating documents:', e);

      // Spezifische Fehler behandeln und entsprechende HTTP-Statuscodes und Fehlermeldungen zurückgeben
      if (e instanceof SomeSpecificError) {
        res.status(400).json({ message: 'Some specific error occurred', success: false });
      } else {
        res.status(500).json({ message: 'Error creating documents', success: false });
      }
    }
  } catch (error) {
    console.error('Registration error:', error);

    // Spezifische Fehler behandeln und entsprechende HTTP-Statuscodes und Fehlermeldungen zurückgeben
    if (error.code === 'auth/weak-password') {
      res.status(400).json({ message: 'Weak password', success: false });
    } else if (error.code === 'auth/email-already-in-use') {
      res.status(400).json({ message: 'Email already in use', success: false });
    } else if (error.code === 'auth/invalid-email') {
        res.status(400).json({ message: 'Invalid email format. Please provide a valid email address.', success: false });
    } else {
      res.status(401).json({ message: `Registration error: ${error.code} - ${error.message}`, success: false });
    }
  }
};



// Anmelden von User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Firebase-Funktion überprüft übergebene Email und Passwort
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const uid = user.uid;

    const token = await generateToken(uid, email);

    // Übergabe der UID an das Frontend
    res.json({ uid, token, success: true });
  } catch (error) {
    console.error('Login error:', error);

    // Spezifische Fehler behandeln und entsprechende HTTP-Statuscodes und Fehlermeldungen zurückgeben
    if (error.code === 'auth/user-not-found') {
      res.status(404).json({ message: 'User not found. Please check your email or register.', success: false });
    } else if (error.code === 'auth/wrong-password') {
      res.status(401).json({ message: 'Incorrect password. Please try again.', success: false });
    } else if (error.code === 'auth/invalid-email') {
      res.status(400).json({ message: 'Invalid email format. Please provide a valid email address.', success: false });
    } else if (error.code === 'auth/user-disabled') {
      res.status(401).json({ message: 'User account is disabled. Please contact support.', success: false });
    } else {
      res.status(401).json({ message: `Login failed: ${error.code} - ${error.message}`, success: false });
    }
  }
};



//Passwort zurücksetzen nicht im code eingebaut.
const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    //Funktion zum zurückstetzen des Passworts
    await firebase.auth().sendPasswordResetEmail(email);

    res.json({ message: 'Password reset email has been sent', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send password reset email',error, success: false });
  }
};


export default {
  register,
  login,
  resetPassword
};