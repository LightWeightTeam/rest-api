import express from 'express';
const trainingrouter = express.Router();
import trainingController from '../controllers/trainingController.mjs';


trainingrouter.get('/getCurrentDate', async (req, res) => {
    const { uid } = req.query;

    try {
        const trainingData = await trainingController.getCurrentDate(uid);
        res.status(200).json(trainingData);
    } catch (error) {
        console.error('Fehler beim Abrufen der CurrentDate:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Mahlzeiten-Daten' });
    }
});

// GET-Funktion für /getTrainingData
trainingrouter.get('/getTrainingData', async (req, res) => {
    try {
        const { uid } = req.query;
        const trainingData = await trainingController.getTrainingData({ uid });
        res.status(200).json(trainingData);
    } catch (error) {
        console.error('Fehler beim Abrufen der Trainingsdaten:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// GET-Funktion für /getTrainingSplitData
trainingrouter.get('/getTrainingSplitData', async (req, res) => {
    try {
        const { selectedGoal, selectedLevel } = req.query;
        const trainingSplitData = await trainingController.getTrainingSplitData({ selectedGoal, selectedLevel });
        res.status(200).json(trainingSplitData);
    } catch (error) {
        console.error('Fehler beim Abrufen der Split-Daten:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// GET-Funktion für /getTrainingDataForDay
trainingrouter.get('/getTrainingDataForDay', async (req, res) => {
    try {
        const { uid, day } = req.query;
        const trainingDataForDay = await trainingController.getTrainingDataForDay({ uid, day });
        res.status(200).json(trainingDataForDay);
    } catch (error) {
        console.error('Fehler beim Abrufen der Trainingsdaten für den Tag:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// GET-Funktion für /getTrainingDataFromFirebase
trainingrouter.get('/getTrainingDataFromFirebase', async (req, res) => {
    try {
        const { uid, selectedDate } = req.query;
        const trainingDataFromFirebase = await trainingController.getTrainingDataFromFirebase({ uid, selectedDate });
        res.status(200).json(trainingDataFromFirebase);
    } catch (error) {
        console.error('Fehler beim Abrufen der Trainingsdaten aus Firebase:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});



trainingrouter.post('/saveTrainingDataToFirebase', trainingController.saveTrainingDataToFirebase);
trainingrouter.post('/saveTrainingData', trainingController.saveTrainingData);
//trainingrouter.post('/getTrainingData', trainingController.getTrainingData);
//trainingrouter.post('/getTrainingSplitData', trainingController.getTrainingSplitData);
//trainingrouter.post('/getTrainingDataForDay', trainingController.getTrainingDataForDay);
//trainingrouter.post('/getTrainingDataForDay', trainingController.getTrainingDataForDay);
//trainingrouter.post('/getTrainingDataFromFirebase', trainingController.getTrainingDataFromFirebase);



export default trainingrouter;

