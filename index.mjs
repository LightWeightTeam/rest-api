import { app } from './app.mjs';
import cors from 'cors';

const port = 8000;
app.use(cors())

app.listen(port, () => {
  console.log(`Server läuft auf ${port}`);
});


import authrouter from './routes/authRoutes.mjs';
app.use('/auth', authrouter);

import uidrouter from './routes/uidRoutes.mjs';
app.use('/uid', uidrouter);

import nutritionrouter from './routes/nutritionRoutes.mjs';
app.use('/nutrition', nutritionrouter);

import trainingrouter from './routes/trainingRoutes.mjs';
app.use('/training', trainingrouter);
