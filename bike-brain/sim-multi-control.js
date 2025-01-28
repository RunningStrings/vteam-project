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

// const MIN_TRIP_DURATION = 10000;

const rl = readline.createInterface({ input, output });

const waitForBackend = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            await axios.get(`${API_URL}/bikes`, {
                params: { limit: 1 },
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': process.env.BIKE_TOKEN
                }
            });
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
    const bikes = [];
    let offset = 0; // Used to track how many records have been processed

    try {
        // Fetch bikes in batches
        while (true) {
            const response = await axios.get(`${API_URL}/bikes`, {
                params: { offset, limit: BATCH_SIZE },
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': process.env.BIKE_TOKEN
                }
            });

            console.log('API Response:', JSON.stringify(response.data, null, 2));

            const batch = response.data?.data;
            console.log(batch);

            if (!batch || batch.length === 0) break;

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
        const response = await axios.get(`${API_URL}/users`, {
            headers: {
                'Content-Type': 'application/json', // Optional, specify the content type
                'x-access-token': process.env.BIKE_TOKEN // Replace with your token variable
            }
        });

        const users = response.data?.data || [];

        return users.filter(user => user.role === 'customer');
    } catch (error) {
        console.error("Error loading users from database:", error);
        process.exit(1);
    }
};

const simulateBikeMovement = (bike, startLocation, endLocation, startTime, endTime, steps) => {
    console.log(`startLocation: ${JSON.stringify(startLocation)}`);
    console.log(`endLocation: ${JSON.stringify(endLocation)}`);

    const totalDuration = endTime - startTime;
    const timeStep = totalDuration / steps;
    const distanceStepX = (endLocation.lat - startLocation.lat) / steps;
    const distanceStepY = (endLocation.lon - startLocation.lon) / steps;

    for (let i = 0; i <= steps; i ++) {
        const currentTime = new Date(startTime.getTime() + i * timeStep);
        const currentLocation = {
            type: 'Point',
            coordinates: [
                startLocation.coordinates[0] + i * distanceStepX,
                startLocation.coordinates[1] + i * distanceStepY,
            ],
        };

        bike.updateLocation(currentLocation);
    }
};

const calcBatteryDepletion = (bike) => {
    let depletionRate = 0;

    switch (bike.status) {
        case 'in-use':
            depletionRate = 0.2 + Math.random() * 0.1;
            break;
        case 'available':
            depletionRate = 0.1 + Math.random() * 0.1;
            break;
        case 'charging':
            depletionRate = -5 - Math.random() * 2;
            break;
        case 'maintenance':
            depletionRate = 0;
            break;
        default:
            depletionRate = 0.05;
    }

    const speedFactor = bike.speed > 0 ? bike.speed * 0.01 : 0;

    const randomFactor = Math.random() * 0.1;

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
            // Randomize a trip duration between 30 seconds and 5 minutes.
            const MIN_TRIP_DURATION = Math.floor(Math.random() * (300000 - 30000 + 1)) + 30000;

            if (bike.tripCurrent && bike.tripCurrent.is_active) {
                if (Date.now() - bike.tripCurrent.startTime >= MIN_TRIP_DURATION) {
                // if (bike.tripCurrent && bike.tripCurrent.is_active) {
                    bike.checkAndUpdateSpeed(0);
                    bike.stopRental();

                    const customer = customers.find(c => c._id === bike.tripCurrent.customerId);
                    if (customer) {
                        customer.activeRental = null; // Reset activeRental when rent ends.
                    }
                } else {
                    // Define the distance for each movement step in degrees
                    const movementStep = 0.0005;

                    // Randomize the direction (angle in radians)
                    const angle = Math.random() * 2 * Math.PI;

                    // Calculate the change in latitude and longitude based on the angle and step size
                    const deltaLat = movementStep * Math.cos(angle);
                    const deltaLon = movementStep * Math.sin(angle);

                    // Update the location with the calculated changes
                    const newLat = bike.location.coordinates[0] + deltaLat;
                    const newLon = bike.location.coordinates[1] + deltaLon;

                    bike.updateLocation({ type: 'Point', coordinates: [newLat, newLon] });
                }
            }

            const newBatteryLevel = calcBatteryDepletion(bike);
            bike.updateBattery(newBatteryLevel);

            if (Math.random() > 0.9 && !bike.tripCurrent?.is_active) {
                const availableCustomers = customers.filter(customer => !customer.activeRental);
                if (availableCustomers.length > 0) {
                    const customer = availableCustomers[Math.floor(Math.random() * availableCustomers.length)];
                    bike.startRental(customer._id);
                    customer.activeRental = bike.tripCurrent;
                    bike.checkAndUpdateSpeed(20);
                }
            }
        });
    } try {
        const activeRentals = bikes.filter((bike) => bike.tripCurrent && bike.tripCurrent.is_active).length;
        console.log(`Active rentals: ${activeRentals}`);
    } catch (error) {
        console.error("Error during simulation update:", error);
    }
};

// Simulation is started with 'start' or 's' + 'Enter', 
// paused with 'pause' or 'p'and runs until 
// stopped with 'exit', 'quit', or 'q' + 'Enter'.
const startSimulation = async () => {
    try {
        await waitForBackend();

        const bikes = await loadBikesFromDatabase();
        const customers = await loadUsersFromDatabase();

        console.log("Simulation ready. Type 'start' to begin.");

        let intervalId = null;
        let simulationRunning = false;

        while (true) {
            const command = await rl.question("simulation> ");
            switch (command.trim().toLowerCase()) {
                case "start":
                case "s":
                    if (simulationRunning) {
                        console.log("Simulation is already running.");
                    } else {
                        intervalId = setInterval(() => simulateBikeUpdates(bikes, customers), 3000);
                        simulationRunning = true;
                        console.log("Simulation started.");
                    }
                    break;
                case "pause":
                case "p":
                    if (simulationRunning) {
                        clearInterval(intervalId);
                        simulationRunning = false;
                        console.log("Simulation paused.");
                    } else {
                        console.log("Simulation is not running.");
                    }
                    break;
                case "quit":
                case "exit":
                case "q":
                    if (intervalId) clearInterval(intervalId);
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
