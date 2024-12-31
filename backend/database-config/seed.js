import * as dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonFile, getJsonFilesFromDirectory } from '../data-generation/fileDirectoryUtils.js'; // Import utilities

dotenv.config();

// A script to populate the database
const seedData = async () => {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    // Resolve __dirname and data paths
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const dataJsonDir = path.join(__dirname, '../data-json'); // Root data folder

    // Get the file name based on NODE_ENV ('simulering' for big, anything else for small)
    const bikePath = process.env.NODE_ENV === 'simulering'
    ? 'bikes_big.json'
    : 'bikes_small.json';

    const userPath = process.env.NODE_ENV === 'simulering'
    ? 'users_big.json'
    : 'users_small.json';

    try {
        // Load external JSON data files using utility functions
        const bikesData = readJsonFile(path.join(dataJsonDir, bikePath));
        const citiesData = readJsonFile(path.join(dataJsonDir, 'cities.json'));
        const usersData = readJsonFile(path.join(dataJsonDir, userPath));

        // Use getJsonFilesFromDirectory to collect all station and parking files
        const stationFiles = getJsonFilesFromDirectory(path.join(dataJsonDir, 'stations'));
        const stationsData = stationFiles.map(filePath => readJsonFile(filePath));

        const parkingFiles = getJsonFilesFromDirectory(path.join(dataJsonDir, 'parkings'));
        const parkingsData = parkingFiles.map(filePath => readJsonFile(filePath));

        if (!bikesData || !citiesData || !usersData) {
            throw new Error('Error loading necessary JSON files');
        }

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
        await seedCollection('stations', stationsData.flat()); // Flatten the station data
        await seedCollection('parkings', parkingsData.flat()); // Flatten the parking data
        await seedCollection('cities', citiesData);
        await seedCollection('users', usersData);

        console.log('Database seeded!');
    } catch (error) {
        console.error('Error seeding database:', error.message || error);
    } finally {
        await client.close();
    }
};

seedData();
