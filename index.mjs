import { app } from './app.mjs';
import authrouter from './routes/authRoutes.mjs';
import uidrouter from './routes/uidRoutes.mjs';
import nutritionrouter from './routes/nutritionRoutes.mjs';
import trainingrouter from './routes/trainingRoutes.mjs';

app.use('/auth', authrouter);
app.use('/uid', uidrouter);
app.use('/nutrition', nutritionrouter);
app.use('/training', trainingrouter);

export default app;

