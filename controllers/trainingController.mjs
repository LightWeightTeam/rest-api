import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import config from '../firebaseKeys/configKey.mjs';
import admin from 'firebase-admin';
import serviceAccount from '../firebaseKeys/serviceAccountKey.mjs';




const clientApp = firebase.initializeApp(config);
const adminApp = admin.app();





const getTrainingSplitData = async (req, res) => {
  try {
    const { selectedGoal, selectedLevel } = req.body;

    if (!selectedGoal || !selectedLevel) {
      return res.status(400).json({ message: 'Fehlende Daten', success: false });
    }

    const planRef = admin.firestore().collection('plan').doc(selectedGoal);
    const selectedLevelRef = planRef.collection(selectedLevel);
    const allSplitsDocs = await selectedLevelRef.listDocuments();

    const allSplitsData = {};

    for (const splitDoc of allSplitsDocs) {
      const splitName = splitDoc.id;
      const splitRef = selectedLevelRef.doc(splitName);
      const daysRef = splitRef.collection('days');
      const allDaysDocs = await daysRef.listDocuments();

      const splitData = {};

      for (const dayDoc of allDaysDocs) {
        const dayName = dayDoc.id;
        const dayRef = daysRef.doc(dayName);
        const subCollectionRef = await dayRef.listCollections();

        const dayData = {};

        for (const subCollection of subCollectionRef) {
          const subCollectionName = subCollection.id;
          const exercisesDocs = await subCollection.get();

          const exercisesData = [];

          exercisesDocs.forEach((exerciseDoc) => {
            const exerciseId = exerciseDoc.id;
            const exerciseData = exerciseDoc.data(); // Anpassen entsprechend der Struktur Ihrer Daten

            exercisesData.push({
              id: exerciseId,
              data: exerciseData
            });
          });

          dayData[subCollectionName] = exercisesData;
        }

        splitData[dayName] = dayData;
      }

      allSplitsData[splitName] = splitData;
    }

    return res.status(200).json({
      message: 'Daten erfolgreich abgerufen',
      success: true,
      data: allSplitsData
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    return res.status(500).json({ message: 'Interner Serverfehler', success: false });
  }
};




export default {

  getTrainingSplitData,

};

