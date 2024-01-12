// index.js
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, this is your Express API!' });
});

app.post('/api/data', (req, res) => {
  const data = req.body;
  res.json({ message: 'Data received successfully', data });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
