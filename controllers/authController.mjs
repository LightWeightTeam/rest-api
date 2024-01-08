import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import config from '../firebaseKeys/configKey.mjs';


const app = firebase.initializeApp(config);


//Registrieren von Usern
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const uid = user.uid;

    try {
      // Email wird in users -> uid gespeichert
      await firebase.firestore().collection('users').doc(uid).set({
        'email': email
      });

      // Basic_calories wird beim erstellen des accounts bereits erstellt in users -> uid -> nutrition -> food_values
      await firebase.firestore().collection('users').doc(uid).collection('nutrition').doc('food_values').set({
        'basic_calories': 0
      });

      console.log('Documents created');
      res.json({ uid, success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Error creating documents', success: false });
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(401).json({ message: `Registration error: ${errorCode} - ${errorMessage}`, success: false });
  }
};


//Anmelden von User
const login = async (req, res) => {
  const { email, password } = req.body;

  //Ausgabe der Anfrage in der Console
  console.log('Request body:', req.body);

  try {
    //Firebase funktion überprüft übergebene Email und Passwort
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const uid = user.uid;

    //Übergabe der UID an das Frontend
    res.json({ uid, success: true });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    res.status(401).json({ message: `Login failed: ${errorCode} - ${errorMessage}`, success: false });
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