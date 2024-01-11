import express from 'express';
import firebase from 'firebase/compat/app';
import admin from "firebase-admin";
import serviceAccount from '../firebaseKeys/serviceAccountKey.mjs';
import config from '../firebaseKeys/configKey.mjs';

const app = express();

try {
  // Firebase initialisieren
  firebase.initializeApp(config);
  console.log('Firebase wurde erfolgreich initialisiert');
} catch (error) {
  console.error('Fehler beim Initialisieren von Firebase:', error);
}

app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lightweight-58f7b-default-rtdb.europe-west1.firebasedatabase.app"
});

export { app, admin };
