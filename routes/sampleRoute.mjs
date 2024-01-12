import express from 'express';
const router = express.Router();
import sampleController from '../controllers/sampleController.mjs';

// Definiere Routen
router.get('/', sampleController.getSampleData);
router.post('/', sampleController.createSampleData);

export default router;

