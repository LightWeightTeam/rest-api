import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import config from '../firebaseKeys/configKey.mjs';
import admin from 'firebase-admin';


const clientApp = firebase.initializeApp(config);
const adminApp = admin.app();


const saveTrainingData = async (req, res) => {
  try {
    const { uid, selectedGoal, selectedLevel, selectedSplit, currentDate } = req.body;

    if (!uid || !selectedGoal || !selectedLevel || !selectedSplit || !currentDate) {
      return res.status(400).json({ message: 'Fehlende Daten', success: false });
    }

    const userRef = firebase.firestore().collection('users').doc(uid);
    const trainingRef = userRef.collection('training').doc('currentPlan');

    await trainingRef.set({
      selectedGoal,
      selectedLevel,
      selectedSplit,
      currentDate
    }, { merge: true });

    return res.status(200).json({ message: 'Daten erfolgreich gespeichert', success: true });
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
    return res.status(500).json({ message: 'Interner Serverfehler', success: false });
  }
};





const getTrainingData = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ message: 'Fehlende Benutzer-ID', success: false });
    }

    const userRef = admin.firestore().collection('users').doc(uid);
    const trainingRef = userRef.collection('training').doc('currentPlan');
    const trainingDoc = await trainingRef.get();

    if (!trainingDoc.exists) {
      return res.status(404).json({ message: 'Keine Trainingsdaten gefunden', success: false });
    }

    const trainingData = trainingDoc.data();
    const { selectedGoal, selectedLevel, selectedSplit } = trainingData;

    const planRef = admin.firestore().collection('plan').doc(selectedGoal);
    const selectedLevelRef = planRef.collection(selectedLevel).doc(selectedSplit);
    const selectedSplitDoc = await selectedLevelRef.get();

    if (!selectedSplitDoc.exists) {
      return res.status(404).json({ message: 'Keine entsprechenden Daten gefunden', success: false });
    }

    const formattedData = {};

    const subcollectionNames = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"];

    for (const subcollectionName of subcollectionNames) {
      const subcollectionDocs = await selectedSplitDoc.ref
        .collection(subcollectionName)
        .get();

      const subCollectionData = [];

      for (const doc of subcollectionDocs.docs) {
        const nestedCollections = await doc.ref.listCollections();
        const nestedCollectionData = [];

        for (const nestedCol of nestedCollections) {
          const nestedDocs = await nestedCol.get();
          const nestedDocsData = {};

          nestedDocs.forEach((nestedDoc) => {
            nestedDocsData[nestedDoc.id] = nestedDoc.data();
          });

          nestedCollectionData.push({
            exercise: nestedCol.id,
            info: nestedDocsData
          });
        }

        subCollectionData.push({
          id: doc.id,
          data: {
            ...doc.data(),
            nestedCollections: nestedCollectionData
          }
        });
      }

      formattedData[subcollectionName] = subCollectionData;
    }

    return res.status(200).json({
      message: 'Daten erfolgreich abgerufen',
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    return res.status(500).json({ message: 'Interner Serverfehler', success: false });
  }
};


const getTrainingDataForDay = async (uid, day) => {
  try {

    if (!uid || !day) {
      return res.status(400).json({ message: 'Fehlende Benutzer-ID oder Tag', success: false });
    }

    const userRef = admin.firestore().collection('users').doc(uid);
    const trainingRef = userRef.collection('training').doc('currentPlan');
    const trainingDoc = await trainingRef.get();

    if (!trainingDoc.exists) {
      return res.status(404).json({ message: 'Keine Trainingsdaten gefunden', success: false });
    }

    const trainingData = trainingDoc.data();
    const { selectedGoal, selectedLevel, selectedSplit } = trainingData;

    const planRef = admin.firestore().collection('plan').doc(selectedGoal);
    const selectedLevelRef = planRef.collection(selectedLevel).doc(selectedSplit);
    const selectedSplitDoc = await selectedLevelRef.get();

    if (!selectedSplitDoc.exists) {
      return res.status(404).json({ message: 'Keine entsprechenden Daten gefunden', success: false });
    }

    const allSplitsData = {};
    const splitData = {};
    const splitName = selectedSplitDoc.id;

    const daysRef = selectedSplitDoc.ref.collection('days');
    const dayDoc = await daysRef.doc(day).get();

    if (!dayDoc.exists) {
      return res.status(404).json({ message: `Keine Daten für Tag ${day} gefunden`, success: false });
    }

    const subCollectionRef = await dayDoc.ref.listCollections();

    for (const subCollection of subCollectionRef) {
      const subCollectionName = subCollection.id;
      const exercisesDocs = await subCollection.get();

      const exercisesData = [];

      exercisesDocs.forEach((exerciseDoc) => {
        const exerciseId = exerciseDoc.id;
        const exerciseData = exerciseDoc.data();

        exercisesData.push({
          id: exerciseId,
          data: exerciseData
        });
      });

      splitData[subCollectionName] = exercisesData;
    }

    allSplitsData[splitName] = splitData;

    return res.status(200).json({
      message: `Daten für Tag ${day} erfolgreich abgerufen`,
      success: true,
      data: allSplitsData
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    return res.status(500).json({ message: 'Interner Serverfehler', success: false });
  }
};




const getCurrentDate = async (uid) => {
  try {
    const trainingRef = firebase.firestore().collection('users').doc(uid).collection('training');
    const currentPlanRef = trainingRef.doc('currentPlan');

    const currentDateData = await currentPlanRef.get();

    if (currentDateData.exists) {
      const {currentDate = 0} = currentDateData.data() || {};

      return { currentDate };
    } else {
      console.error(`currentDate nicht gefunden`);
      return null;
    }
  }
  catch (error){
    console.error('Fehler beim Lesen currentDate:', error);
    throw error;
  }
};



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

//Hier soll vielleicht noch überprüft werden ob savedTraining als Doc bereits exisitiert.
const saveTrainingDataToFirebase = async (req, res) => {
  try {
    const {
      uid,
      weight,
      rep,
      exerciseID,
      splitName,
      selectedDate,
    } = req.body;

    if (!uid || !weight || !rep || !exerciseID || !splitName || !selectedDate) {
      return res.status(400).json({ message: 'Fehlende Daten', success: false });
    }

    const userRef = firebase.firestore().collection('users').doc(uid);
    const trainingRef = userRef.collection('training').doc('savedTraining').collection(selectedDate);
    const splitRef = trainingRef.doc(splitName);
    const exerciseRef = splitRef.collection(exerciseID);


    const latestSetDoc = await exerciseRef.orderBy('set', 'desc').limit(1).get();
    let nextSetNumber = 1;

    if (!latestSetDoc.empty) {
      const latestSetData = latestSetDoc.docs[0].data();
      nextSetNumber = latestSetData.set + 1;
    }

    const setRef = exerciseRef.doc(nextSetNumber.toString());

    await setRef.set({
      weight,
      rep,
      set: nextSetNumber,
    });

    return res.status(200).json({ message: 'Daten erfolgreich gespeichert', success: true });
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
    return res.status(500).json({ message: 'Interner Serverfehler', success: false });
  }
}

const getTrainingDataFromFirebase = async (req, res) => {
  try {
    const { uid, selectedDate } = req.body;

    if (!uid || !selectedDate) {
      return res.status(400).json({ message: 'Fehlende Daten', success: false });
    }

    const userRef = firebase.firestore().collection('users').doc(uid);
    const trainingRef = userRef.collection('training').doc('savedTraining').collection(selectedDate);

    const snapshot = await trainingRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Keine Daten gefunden', success: false });
    }

    const data = [];

    snapshot.forEach((splitDoc) => {
      const splitName = splitDoc.id;
      const exercises = [];

      splitDoc.ref.collectionGroup('*').get().then((exerciseSnapshot) => {
        exerciseSnapshot.forEach((exerciseDoc) => {
          const sets = [];

          exerciseDoc.ref.collection('*').get().then((setSnapshot) => {
            setSnapshot.forEach((setDoc) => {
              const setData = setDoc.data();
              sets.push(setData);
            });
          });

          const exerciseData = {
            exerciseID: exerciseDoc.id,
            sets,
          };

          exercises.push(exerciseData);
        });
      });

      const splitData = {
        splitName,
        exercises,
      };

      data.push(splitData);
    });

    return res.status(200).json({ data, success: true });
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
    return res.status(500).json({ message: 'Interner Serverfehler', success: false });
  }
}




export default {
  saveTrainingData,
  getTrainingData,
  getTrainingSplitData,
  getTrainingDataForDay,
  getCurrentDate,
  saveTrainingDataToFirebase,
  getTrainingDataFromFirebase 
};


/*
const getTrainingData = async (uid) => {
  try {
    if (!uid) {
      throw new Error('Fehlende Benutzer-ID');
    }

    // Daten aus col. users -> doc. uid -> col. training -> doc. currentPlan abrufen
    const userRef = db.collection('users').doc(uid);
    const trainingRef = userRef.collection('training').doc('currentPlan');
    const trainingDoc = await trainingRef.get();

    if (!trainingDoc.exists) {
      throw new Error('Keine Daten gefunden');
    }

    const trainingData = trainingDoc.data();
    const { selectedGoal, selectedLevel, selectedSplit } = trainingData;

    console.log('selectedGoal:', selectedGoal);
    console.log('selectedLevel:', selectedLevel);
    console.log('selectedSplit:', selectedSplit);

    // Überprüfen, ob die Felder vorhanden sind
    if (!selectedGoal || !selectedLevel || !selectedSplit) {
      throw new Error('Fehlende Felder in aktuellen Trainingsdaten');
    }

    // Daten aus col. plan -> doc. variable selectedGoal -> col. variable selectedLevel -> doc selectedSplit abrufen
    const planRef = db.collection('plan').doc(selectedGoal);
    const selectedLevelRef = planRef.collection(selectedLevel);
    const selectedSplitRef = selectedLevelRef.doc(selectedSplit);
    
    const selectedSplitDoc = await selectedSplitRef.get();

    if (!selectedSplitDoc.exists) {
      throw new Error('Keine Daten gefunden für ausgewähltes Level und Split');
    }

    const allCollectionsAndDocs = {};

    // Alle Collections und Dokumente unter selectedSplit sammeln
    const selectedSplitSnapshot = await selectedSplitRef.parent.listCollections();
    
    for (const collection of selectedSplitSnapshot) {
      const collectionName = collection.id;
      const docs = await collection.get();

      allCollectionsAndDocs[collectionName] = [];
      
      docs.forEach((doc) => {
        allCollectionsAndDocs[collectionName].push(doc.data());
      });
    }

    return allCollectionsAndDocs;
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    throw new Error('Fehler beim Abrufen der Daten');
  }
};



const getTrainingData = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ message: 'Fehlende Benutzer-ID', success: false });
    }

    const userRef = firebase.firestore().collection('users').doc(uid);
    const trainingRef = userRef.collection('training').doc('currentPlan');
    const trainingDoc = await trainingRef.get();

    if (!trainingDoc.exists) {
      return res.status(404).json({ message: 'Keine Trainingsdaten gefunden', success: false });
    }

    const trainingData = trainingDoc.data();

    return res.status(200).json({ message: 'Trainingsdaten erfolgreich abgerufen', success: true, data: trainingData });
  } catch (error) {
    console.error('Fehler beim Abrufen der Trainingsdaten:', error);
    return res.status(500).json({ message: 'Interner Serverfehler', success: false });
  }
};
*/






/*
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
      const splitData = {};

      const subcollectionNames = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"];

      for (const subcollectionName of subcollectionNames) {
        const subcollectionDocs = await splitRef.collection(subcollectionName).get();

        const subCollectionData = [];

        for (const doc of subcollectionDocs.docs) {
          const nestedCollections = await doc.ref.listCollections();
          const nestedCollectionData = [];

          for (const nestedCol of nestedCollections) {
            const nestedDocs = await nestedCol.get();
            const nestedDocsData = {};

            nestedDocs.forEach((nestedDoc) => {
              nestedDocsData[nestedDoc.id] = nestedDoc.data();
            });

            nestedCollectionData.push({
              exercise: nestedCol.id,
              info: nestedDocsData
            });
          }

          subCollectionData.push({
            id: doc.id,
            data: {
              ...doc.data(),
              nestedCollections: nestedCollectionData
            }
          });
        }

        splitData[subcollectionName] = subCollectionData;
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
const getTrainingDataForDay = async (req, res) => {
  try {
    const { uid, day } = req.body;

    if (!uid || !day) {
      return res.status(400).json({ message: 'Fehlende Benutzer-ID oder Tag', success: false });
    }

    const userRef = admin.firestore().collection('users').doc(uid);
    const trainingRef = userRef.collection('training').doc('currentPlan');
    const trainingDoc = await trainingRef.get();

    if (!trainingDoc.exists) {
      return res.status(404).json({ message: 'Keine Trainingsdaten gefunden', success: false });
    }

    const trainingData = trainingDoc.data();
    const { selectedGoal, selectedLevel, selectedSplit } = trainingData;

    const planRef = admin.firestore().collection('plan').doc(selectedGoal);
    const selectedLevelRef = planRef.collection(selectedLevel).doc(selectedSplit);
    const selectedSplitDoc = await selectedLevelRef.get();

    if (!selectedSplitDoc.exists) {
      return res.status(404).json({ message: 'Keine entsprechenden Daten gefunden', success: false });
    }

    const formattedData = {};

    const subcollectionName = day; // 'day' wird verwendet, um nur die Daten für diesen Tag abzurufen

    const subcollectionDocs = await selectedSplitDoc.ref
      .collection(subcollectionName)
      .get();

    if (subcollectionDocs.empty) {
      return res.status(404).json({ message: `Keine Daten für ${subcollectionName} gefunden`, success: false });
    }

    const subCollectionData = [];

    for (const doc of subcollectionDocs.docs) {
      const nestedCollections = await doc.ref.listCollections();
      const nestedCollectionData = [];

      for (const nestedCol of nestedCollections) {
        const nestedDocs = await nestedCol.get();
        const nestedDocsData = {};

        nestedDocs.forEach((nestedDoc) => {
          nestedDocsData[nestedDoc.id] = nestedDoc.data();
        });

        nestedCollectionData.push({
          exercise: nestedCol.id,
          info: nestedDocsData
        });
      }

      subCollectionData.push({
        id: doc.id,
        data: {
          ...doc.data(),
          nestedCollections: nestedCollectionData
        }
      });
    }

    formattedData[subcollectionName] = subCollectionData;

    return res.status(200).json({
      message: `Daten für ${subcollectionName} erfolgreich abgerufen`,
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    return res.status(500).json({ message: 'Interner Serverfehler', success: false });
  }
};


*/