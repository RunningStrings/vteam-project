import axios from "axios";
import BikeBrain from "./bike-brain.js";
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const API_URL = 'http://localhost:5000/api/v1/bikes';

const BATCH_SIZE = 200;

const loadBikesFromDatabase = async () => {
    const bikes = [];
    let offset = 0; // Used to track how many records have been processed

    try {
        // Fetch bikes in batches
        while (true) {
            const response = await axios.get(API_URL, {
                params: { offset, limit: BATCH_SIZE }
            });

            console.log('API Response:', JSON.stringify(response.data, null, 2));

            const batch = response.data?.data?.result;
            console.log(batch);

            if (!Array.isArray(batch)) {
                console.error('Expected an array in response.data.result, but got:', batch);
                break;  // Exit the loop if data isn't as expected
            }

            if (batch.length === 0) break;

            batch.forEach(doc => {
                const bike = new BikeBrain(doc._id, doc.city_id, doc.location, doc.status);
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
    }
};

const calcBatteryDepletion = (bike) => {
    let depletionRate = 0;

    switch (bike.status) {
        case 'in-use':
            depletionRate = 2 + Math.random() * 3;
            break;
        case 'available':
            depletionRate = 0.5 + Math.random() * 1;
            break;
        case 'charging':
            depletionRate = -3 - Math.random() * 2;
            break;
        case 'maintenance':
            depletionRate = 0;
            break;
        default:
            depletionRate = 0.2;
    }

    const speedFactor = bike.speed * 0.05;

    const randomFactor = Math.random() * 0.5;

    const newBatteryLevel = bike.batteryLevel - depletionRate - speedFactor - randomFactor;

    return Math.max(0, Math.min(100, newBatteryLevel));
};

const simulateBikeUpdates = (bikes) => {
    // Batch process bikes to (hopefully) improve performance
    for (let i = 0; i < bikes.length; i += BATCH_SIZE) {
        const batch = bikes.slice(i, i + BATCH_SIZE);
        batch.forEach((bike) => {
            bike.updateLocation(
                bike.location.lat + (Math.random() - 0.5) * 0.001,
                bike.location.lon + (Math.random() - 0.5) * 0.001
            );
            bike.updateSpeed(Math.floor(Math.random() * 20));
            const newBatteryLevel = calcBatteryDepletion(bike);
            bike.updateBattery(newBatteryLevel);

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

    const intervalId = setInterval(() => simulateBikeUpdates(bikes), 3000);

    process.on('SIGINT', () => {
        clearInterval(intervalId);
        console.log('Simulation ended.');
        process.exit(0);
    });
};

runSimulation();
