import express from 'express';
const uidrouter = express.Router();
import uidController from '../controllers/uidController.mjs';


uidrouter.get('/checkUid', uidController.checkUid);


export default uidrouter;