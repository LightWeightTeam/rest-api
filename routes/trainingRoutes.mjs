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
trainingrouter.post('/getTrainingData', trainingController.getTrainingData);
trainingrouter.post('/getTrainingSplitData', trainingController.getTrainingSplitData);
trainingrouter.post('/getTrainingDataForDay', trainingController.getTrainingDataForDay);
trainingrouter.post('/getTrainingDataForDay', trainingController.getTrainingDataForDay);
trainingrouter.post('/getTrainingDataFromFirebase', trainingController.getTrainingDataFromFirebase);

export default trainingrouter;

