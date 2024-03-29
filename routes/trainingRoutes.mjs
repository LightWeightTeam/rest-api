import express from 'express';
const trainingrouter = express.Router();
import trainingController from '../controllers/trainingController.mjs';
import tokenController from '../controllers/tokenController.mjs';

trainingrouter.get('/getCurrentDate', tokenController.authenticateToken, async (req, res) => {
    const { uid } = req.query;
  
    try {
      const trainingData = await trainingController.getCurrentDate(uid);
      res.status(200).json(trainingData);
    } catch (error) {
      console.error('Fehler beim Abrufen der CurrentDate:', error.message);
      res.status(500).json({ error: 'Fehler beim Abrufen der Mahlzeiten-Daten' });
    }
  });




trainingrouter.post('/saveTrainingDataToFirebase', trainingController.saveTrainingDataToFirebase);
trainingrouter.post('/saveTrainingData',tokenController.authenticateToken, trainingController.saveTrainingData);
trainingrouter.post('/TrainingData',tokenController.authenticateToken, trainingController.TrainingData);
trainingrouter.post('/TrainingSplitData', tokenController.authenticateToken, trainingController.TrainingSplitData);
trainingrouter.post('/TrainingDataForDay', trainingController.TrainingDataForDay);
trainingrouter.post('/TrainingDataForDaySplitSelect', trainingController.TrainingDataForDaySplitSelect);
trainingrouter.post('/TrainingDataFromFirebase',tokenController.authenticateToken, trainingController.TrainingDataFromFirebase);
trainingrouter.post('/SplitNameForDay',tokenController.authenticateToken, trainingController.SplitNameForDay);
trainingrouter.post('/getTrainingDataFromFirebase', trainingController.getTrainingDataFromFirebase);


export default trainingrouter;

