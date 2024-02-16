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




trainingrouter.post('/saveTrainingDataToFirebase', trainingController.saveTrainingDataToFirebase);
trainingrouter.post('/saveTrainingData', trainingController.saveTrainingData);
trainingrouter.post('/TrainingData', trainingController.TrainingData);
trainingrouter.post('/TrainingSplitData', trainingController.TrainingSplitData);
trainingrouter.post('/TrainingDataForDay', trainingController.TrainingDataForDay);
trainingrouter.post('/TrainingDataFromFirebase', trainingController.TrainingDataFromFirebase);



export default trainingrouter;

