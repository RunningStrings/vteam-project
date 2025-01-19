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
        if (bike.status !== 'available') {
            console.log(`Bike status is '${bike.status}. Making it available...`);
            bike.controlBike('make-available');
        }
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

const simulateBikeUpdates = (bike, customers) => {
    if (bike.tripCurrent && bike.tripCurrent.is_active) {
        // Update bike location and handle rental end
        const newLat = bike.location.coordinates[0] + (Math.random() - 0.5) * 0.001;
        const newLon = bike.location.coordinates[1] + (Math.random() - 0.5) * 0.001;
        bike.updateLocation({ type: 'Point', coordinates: [newLat, newLon] });
        console.log(`Bike ${bike.id} is moving:`, bike.location);

        setTimeout(() => {
            if (bike.tripCurrent && bike.tripCurrent.is_active) {
                console.log(`Bike ${bike.id} rental ending.`);
                bike.stopRental();
            }
        }, Math.random() * 30000 + 30000); // Between 30s and 60s
    } 

    // Attempt to start a new rental using randomization
    const shouldStartNewRental = Math.random() < 0.5;

    if (!bike.tripCurrent?.is_active && shouldStartNewRental) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        if (customer) {
            console.log(`Bike ${bike.id} starting a new rental for customer ${customer._id}`);
            bike.startRental(customer._id);
        }
    }

    // Emit bike data to the backend via WebSocket
    socket.emit("bike-update", bike.getBikeData());
    console.log(`Updated bike data:`, bike.getBikeData());
};


// Simulation runs until stopped with 'exit, 'quit' or 'q'.
const startSimulation = async () => {
    try {
        await waitForBackend();

        const bike = await loadBikesFromDatabase();
        const customers = await loadUsersFromDatabase();

        console.log("Simulation started for a single bike. Type 'exit', 'quit', or 'q' to stop.");

        // Run simulation at intervals of 3 seconds
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
