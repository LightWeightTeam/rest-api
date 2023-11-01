import { app } from './app.mjs';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

import router from './routes/authRoutes.mjs';
app.use('/auth', router);
