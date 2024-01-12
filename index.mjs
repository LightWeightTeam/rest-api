import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

// Middleware für JSON-Daten
app.use(express.json());

// Routen
import sampleRoute from './routes/sampleRoute.mjs';
app.use('/api/sample', sampleRoute);

// Starte den Server
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});


