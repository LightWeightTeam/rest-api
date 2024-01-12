import { app } from './app.mjs';

const PORT = process.env.PORT || 3000;

//app.listen(PORT, () => {
//  console.log(`Server läuft auf http://localhost:${PORT}`);
//});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server läuft auf http://0.0.0.0:${PORT}`);
});


import authrouter from './routes/authRoutes.mjs';
app.use('/auth', authrouter);

import uidrouter from './routes/uidRoutes.mjs';
app.use('/uid', uidrouter);

import nutritionrouter from './routes/nutritionRoutes.mjs';
app.use('/nutrition', nutritionrouter);

import trainingrouter from './routes/trainingRoutes.mjs';
app.use('/training', trainingrouter);