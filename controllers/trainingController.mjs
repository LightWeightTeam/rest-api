import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import config from '../firebaseKeys/configKey.mjs';

  
  const app = firebase.initializeApp(config);