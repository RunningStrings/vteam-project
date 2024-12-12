import express from 'express';
import database from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.get('/users', async (req, res) => {
  try {
    const db = await database.getDb();
    const users = await db.collectionUsers.find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    // res.status(500).send('Server Error');
    res.status(500).json({ errorMessage: "Server Error" });
  }
});

app.get('/bikes', async (req, res) => {
  try {
    const db = await database.getDb();
    const bikes = await db.collectionBikes.find().toArray();
    res.json(bikes);
  } catch (error) {
    console.error('Error fetching bikes:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
