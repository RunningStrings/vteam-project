import * as dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';

dotenv.config();

// A script to populate the database
const seedData = async () => {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    // Resolve json paths
    const __dirname = dirname(fileURLToPath(import.meta.url));

    const bikesPath = path.join(__dirname, '../data_json/bikes.json');
    const chargingStationsPath = path.join(__dirname, '../data_json/charging_stations.json');
    const citiesPath = path.join(__dirname, '../data_json/cities.json');
    const parkingZonesPath = path.join(__dirname, '../data_json/parking_zones.json');
    const usersPath = path.join(__dirname, '../data_json/users.json');

    try {
        // Load external JSON data files
        const bikesJson = await fs.readFile(bikesPath, 'utf-8');
        const chargingStationsJson = await fs.readFile(chargingStationsPath, 'utf-8');
        const citiesJson = await fs.readFile(citiesPath, 'utf-8');
        const parkingZonesJson = await fs.readFile(parkingZonesPath, 'utf-8');
        const usersJson = await fs.readFile(usersPath, 'utf-8');

        // parse JSON data
        const bikesData = JSON.parse(bikesJson);
        const chargingStationsData = JSON.parse(chargingStationsJson);
        const citiesData = JSON.parse(citiesJson);
        const parkingZonesData = JSON.parse(parkingZonesJson);
        const usersData = JSON.parse(usersJson);

        await client.connect();
        const db = client.db('bike_database');

        // Function to seed collections
        const seedCollection = async (collectionName, data) => {
            const collection = db.collection(collectionName);
            const count = await collection.countDocuments();
            if (count === 0) {
                const result = await collection.insertMany(data);
                console.log(`Inserted ${collectionName}:`, result.insertedIds);
            } else {
                console.log(`${collectionName} already has data, skipping seed`);
            }
        };

        // Seed all the collections
        await seedCollection('bikes', bikesData);
        await seedCollection('charging_stations', chargingStationsData);
        await seedCollection('cities', citiesData);
        await seedCollection('parking_zones', parkingZonesData);
        await seedCollection('users', usersData);

        console.log('Database seeded!');
    } catch (error) {
        console.error('Error seeding database:', error.message || error);
    } finally {
        await client.close();
    }
};

seedData();
