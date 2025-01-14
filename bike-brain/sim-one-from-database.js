import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import axios from "axios";
import BikeBrain from "./bike-brain.js";
import io from 'socket.io-client';
import dotenv from 'dotenv';

const socket = io('http://backend:5000');

dotenv.config();

const API_URL = 'http://backend:5000/api/v1';

const BATCH_SIZE = 200;

const MIN_TRIP_DURATION = 1000;

const rl = readline.createInterface({ input, output });

// const startId = parseInt(process.env.BIKE_ID_START, 10);
// const endId = parseInt(process.env.BIKE_ID_EMD, 10);

// if (!startId || !endId) {
//     console.error("Error: BIKE_START_ID and BIKE_END_ID env variables are required.");
//     process.exit(1);
// }

// console.log(`Processing bikes from ${startId} to ${endId}`);

const waitForBackend = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            await axios.get(`${API_URL}/bikes`, { params: { limit: 1 } });
            console.log("Backend is ready.");
            return;
        } catch {
            console.log("Waiting for backend...");
            retries--;
            await new Promise((res) => setTimeout(res, 5000));
        }
    }
    throw new Error("Backend not reachable after multiple attempts.");
};

const loadBikesFromDatabase = async () => {
    try {
        const response = await axios.get(`${API_URL}/bikes`, {
            params: { limit: 4 }
        });

        const bikeData = response.data?.data?.result?.[3];

        if (!bikeData) {
            console.error("No bikes found in the database.");
            process.exit(1);
        }

        const bike = new BikeBrain(bikeData._id, bikeData.id, bikeData.city_name, bikeData.location, bikeData.status);
        console.log("Loaded single bike:", bike);
        return bike;
    } catch (error) {
        console.error("Error loading bike from database:", error);
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
            depletionRate = 1 + Math.random() * 1.5;
            break;
        case 'available':
            depletionRate = 0.2 + Math.random() * 0.5;
            break;
        case 'charging':
            depletionRate = -5 - Math.random() * 2;
            break;
        case 'maintenance':
            depletionRate = 0;
            break;
        default:
            depletionRate = 0.1;
    }

    const speedFactor = bike.speed > 0 ? bike.speed * 0.02 : 0;

    const randomFactor = Math.random() * 0.2;

    const newBatteryLevel = bike.battery - depletionRate - speedFactor - randomFactor;

    return Math.max(0, Math.min(100, newBatteryLevel));
};

const simulateBikeUpdates = (bike, customers) => {
    if (customers.length === 0) {
        console.error("The customers array is empty.");
        return;
    }

    if (bike.tripCurrent && bike.tripCurrent.is_active) {
        const newLat = bike.location.coordinates[0] + (Math.random() - 0.5) * 0.001;
        const newLon = bike.location.coordinates[1] + (Math.random() - 0.5) * 0.001;
        bike.updateLocation({ lat: newLat, lon: newLon });
        bike.updateSpeed(Math.floor(Math.random() * 20));
    }

    const newBatteryLevel = calcBatteryDepletion(bike);
    bike.updateBattery(newBatteryLevel);

    // Start a rental if no active rental exists
    if (!bike.tripCurrent || !bike.tripCurrent.is_active) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        if (customer) {
            bike.startRental(customer._id);

            // Schedule rental to stop after 30 seconds
            setTimeout(() => {
                if (bike.tripCurrent && bike.tripCurrent.is_active) {
                    console.log("Stopping rental automatically after 30 seconds...");
                    bike.stopRental();
                    console.log("Exiting simulation...");
                    process.exit(0);
                }
            }, 30000);
        }
    }

    socket.emit("bike-update", bike.getBikeData());
    console.log(`Updated bike data:`, bike.getBikeData());
};


// Simulation runs until stopped with 'exit', 'quit', or 'q'
const startSimulation = async () => {
    try {
        await waitForBackend();

        const bike = await loadBikesFromDatabase();
        const customers = await loadUsersFromDatabase();

        console.log("Simulation started for a single bike. Type 'exit', 'quit', or 'q' to stop.");

        let intervalId = setInterval(() => simulateBikeUpdates(bike, customers), 3000);

        while (true) {
            const command = await rl.question("simulation> ");
            switch (command.trim().toLowerCase()) {
                case "exit":
                case "quit":
                case "q":
                    clearInterval(intervalId);
                    console.log("Simulation ended.");
                    rl.close();
                    process.exit(0);
                default:
                    console.log(`Unknown command: ${command}`);
            }
        }
    } catch (error) {
        console.error("Failed to start the simulation:", error);
        process.exit(1);
    }
};

startSimulation();
