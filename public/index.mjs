import { app } from './app.mjs';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

/*
const PORT = process.env.PORT || 3000;

//app.listen(PORT, () => {
//  console.log(`Server läuft auf http://localhost:${PORT}`);
//});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server läuft auf http://0.0.0.0:${PORT}`);
});
*/

import authrouter from '../functions/auth/authRoutes.mjs';
app.use('/.netlify/functions/auth', authrouter);

import uidrouter from '../functions/uid/uidRoutes.mjs';
app.use('/.netlify/functions/uid', uidrouter);

import nutritionrouter from '../functions/nutrition/nutritionRoutes.mjs';
app.use('/.netlify/functions/nutrition', nutritionrouter);

import trainingrouter from '../functions/training/trainingRoutes.mjs';
app.use('/.netlify/functions/training', trainingrouter);