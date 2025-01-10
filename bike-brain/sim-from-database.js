import axios from "axios";
import BikeBrain from "./bike-brain.js";
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const API_URL = 'http://localhost:5000/api/v1';

const BATCH_SIZE = 200;

const loadBikesFromDatabase = async () => {
    const bikes = [];
    let offset = 0; // Used to track how many records have been processed

    try {
        // Fetch bikes in batches
        while (true) {
            const response = await axios.get(`${API_URL}/bikes`, {
                params: { offset, limit: BATCH_SIZE }
            });

            console.log('API Response:', JSON.stringify(response.data, null, 2));

            const batch = response.data?.data?.result;
            console.log(batch);

            if (batch.length === 0) break;

            batch.forEach(doc => {
                const bike = new BikeBrain(doc._id, doc.id, doc.city_name, doc.location, doc.status);
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

// Load users from database
const loadUsersFromDatabase = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);

        const users = response.data?.data || [];

        return users.filter(user => user.role === 'customer');
    } catch (error) {
        console.error("Error loading users from database:", error);
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

    const newBatteryLevel = bike.battery - depletionRate - speedFactor - randomFactor;

    return Math.max(0, Math.min(100, newBatteryLevel));
};

const simulateBikeUpdates = (bikes, customers) => {
    if (customers.length === 0) {
        console.error('The customers array is empty.');
        return;
    } else {
        console.log(`There are ${customers.length} customers available for rentals.`);
    }

    // Batch process bikes to (hopefully) improve performance
    for (let i = 0; i < bikes.length; i += BATCH_SIZE) {
        const batch = bikes.slice(i, i + BATCH_SIZE);
        batch.forEach((bike) => {
            if (bike.tripCurrent && bike.tripCurrent.is_active) {
                const newLat = bike.location.coordinates[0] + (Math.random() - 0.5) * 0.001;
                const newLon = bike.location.coordinates[1] + (Math.random() - 0.5) * 0.001;

                bike.updateLocation({ lat: newLat, lon: newLon });

                bike.updateSpeed(Math.floor(Math.random() * 20));
            }

            const newBatteryLevel = calcBatteryDepletion(bike);
            bike.updateBattery(newBatteryLevel);

            if (Math.random() > 0.9 && (!bike.tripCurrent || !bike.tripCurrent.is_active)) {
                const customer = customers[Math.floor(Math.random() * customers.length)];
                if (customer) {
                    bike.startRental(customer._id);
                }
            }

            if (Math.random() > 0.95 && bike.tripCurrent && bike.tripCurrent.is_active) {
                bike.stopRental();
            }
        });

        socket.emit('batch-update', batch.map(bike => bike.getBikeData()));
    }

    const activeRentals = bikes.filter((bike) => bike.tripCurrent && bike.tripCurrent.is_active).length;
    console.log(`Active rentals: ${activeRentals}`);
};

// Simulation runs until stopped with CTRL+c
const runSimulation = async () => {
    const bikes = await loadBikesFromDatabase();
    const customers = await loadUsersFromDatabase();
    console.log("Loaded customers", customers.length, "customers");

    const intervalId = setInterval(() => simulateBikeUpdates(bikes, customers), 3000);

    process.on('SIGINT', () => {
        clearInterval(intervalId);
        console.log('Simulation ended.');
        process.exit(0);
    });
};

runSimulation();
