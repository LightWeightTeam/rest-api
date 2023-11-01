import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import config from '../firebaseKeys/configKey.mjs';
//import { GoogleAuthProvider, getAuth, signInWithCredential } from 'firebase/auth';


const app = firebase.initializeApp(config);


const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const uid = user.uid;

    try {
      await firebase.firestore()
        .collection('users')
        .doc(uid)
        .set({
          'email': email
        });

      console.log('Dokument erstellt');
      res.json({ token: uid, success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Fehler beim Erstellen des Dokuments', success: false });
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(401).json({ message: `Fehler bei der Anmeldung: ${errorCode} - ${errorMessage}`, success: false });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const uid = user.uid; // Hier holen wir die uid des authentifizierten Benutzers

    res.json({ token: uid, success: true }); // Wir verwenden die uid als Token
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(401).json({ message: `Fehler bei der Anmeldung: ${errorCode} - ${errorMessage}`, success: false });
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {

    await firebase.auth().sendPasswordResetEmail(email);

    res.json({ message: 'Passwortrücksetzungs-E-Mail wurde gesendet', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fehler beim Senden der Passwortrücksetzungs-E-Mail',error, success: false });
  }
};




/*
const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const actionCodeSettings = {
      // url: '', // URL entfernt
      handleCodeInApp: true,
    };

    await firebase.auth().sendPasswordResetEmail(email, actionCodeSettings);

    res.json({ message: 'Passwortrücksetzungs-E-Mail wurde gesendet', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fehler beim Senden der Passwortrücksetzungs-E-Mail',error, success: false });
  }
};
*/


export default {
  register,
  login,
  resetPassword
  //signInWithGoogle
};