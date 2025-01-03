import BikeBrain from "./bike-brain";
import { MongoClient } from "mongodb";
import io from 'socket.io-client';

const socket = io('http://backend:5001');

// MongoDB path/database/collection
const MONGO_URI = ;
const DATABASE_NAME = ;
const COLLECTION_NAME = collectionBikes;
const BATCH_SIZE = 200;

const loadBikesFromDatabase = async () => {
    const client = new MongoClient(MONGO_URI);
    const bikes = [];
    let offset = 0; // Used to track how many records have been processed

    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const collectionBikes = db.collection(COLLECTION_NAME);

        // Create cursor
        const cursor = collectionBikes.find().batchSize(BATCH_SIZE);

        // Fetch bikes in batches
        while (true) {
            const batch = await cursor.limit(BATCH_SIZE).skip(offset).toArray();

            if (batch.length === 0) break;

            batch.forEach(doc => {
                const bike = new BikeBrain(doc.id, doc.city, doc.latitude, doc.longitude);
                bikes.push(bike);
            });

            // Log bike creation progress
            offset += BATCH_SIZE; // Increment for the next batch
            console.log(`${bikes.length} bikes have been loaded`);
        }

        // When all bikes have been loaded
        console.log(`${bikes.length} bikes have been loaded from the database.`);
        return bikes;
    } catch (error) {
        console.error("Error loading bikes from database:", error);
        process.exit(1);
    } finally {
        await client.close();
    }
};

const simulateBikeUpdates = (bikes) => {
    // Batch process bikes to (hopefully) improve performance
    for (let i = 0; i < bikes.length; i += BATCH_SIZE) {
        const batch = bikes.slice(i, i + BATCH_SIZE);
        batch.forEach((bike) => {
            bike.updateLocation(
                bike.location.coordinates[0] + (Math.random() - 0.5) * 0.001,
                bike.location.coordinates[1] + (Math.random() - 0.5) * 0.001
            );
            bike.updateSpeed(Math.floor(Math.random() * 30));
            bike.updateBattery(bike.batteryLevel - Math.random() * 5);

            if (Math.random() > 0.9) {
                bike.startRental(`customer${Math.floor(Math.random()) * 1000}`);
            }
            if (Math.random() > 0.95) {
                bike.stopRental();
            }
        });

        socket.emit('batch-update', batch.map(bike => bike.getBikeData()));
    }

    const activeRentals = bikes.filter((bike) => bike.status === 'in-use').length;
    console.log(`Active rentals: ${activeRentals}`);
};

// // Simulation runs for 30 seconds
// const runSimulation = async () => {
//     const bikes = await loadBikesFromDatabase();

//     const intervalId = setInterval(() => simulateBikeUpdates(bikes), 1000);

//     setTimeout(() => {
//         clearInterval(intervalId);
//         console.log('Simulation ended.');

//         bikes.slice(0, 5).forEach((bike) => console.log(bike.id, bike.getBikeData()));

//         process.exit(0);
//     }, 30000);
// };

// Simulation runs until stopped with CTRL+c
const runSimulation = async () => {
    const bikes = await loadBikesFromDatabase();

    const intervalId = setInterval(() => simulateBikeUpdates(bikes), 1000);

    process.on('SIGINT', () => {
        clearInterval(intervalId);
        console.log('Simulation ended.');
        process.exit(0);
    });
};

runSimulation();
