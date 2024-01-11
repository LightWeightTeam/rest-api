// public/index.mjs

import { app } from './app.mjs';
import authrouter from '../netlify/functions/auth/authRoutes.mjs';
import uidrouter from '../netlify/functions/uid/uidRoutes.mjs';
import nutritionrouter from '../netlify/functions/nutrition/nutritionRoutes.mjs';
import trainingrouter from '../netlify/functions/training/trainingRoutes.mjs';

app.use('/.netlify/functions/auth', authrouter);
app.use('/.netlify/functions/uid', uidrouter);
app.use('/.netlify/functions/nutrition', nutritionrouter);
app.use('/.netlify/functions/training', trainingrouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

