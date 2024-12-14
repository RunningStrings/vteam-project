import express from 'express';
import database from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.get('/cities', async (req, res) => {
  try {
    const db = await database.getDb();
    const cities = await db.collectionCities.find().toArray();
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).send('Server Error');
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

app.get('/charging_stations', async (req, res) => {
  try {
    const db = await database.getDb();
    const chargingStations = await db.collectionChargingStations.find().toArray();
    res.json(chargingStations);
  } catch (error) {
    console.error('Error fetching charging stations:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/parking_zones', async (req, res) => {
  try {
    const db = await database.getDb();
    const parkingZones = await db.collectionParkingZones.find().toArray();
    res.json(parkingZones);
  } catch (error) {
    console.error('Error parking zones:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/users', async (req, res) => {
  try {
    const db = await database.getDb();
    const users = await db.collectionUsers.find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Error users:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
