import { app } from './app.mjs';

import trainingrouter from './routes/trainingRoutes.mjs';


app.use('/training', trainingrouter);

export default app;

