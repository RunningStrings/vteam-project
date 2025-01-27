import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import axios from "axios";
import BikeBrain from "./bike-brain.js";
import io from "socket.io-client";
import dotenv from "dotenv";

// eslint-disable-next-line no-unused-vars
const socket = io("http://backend:5000");

dotenv.config();

const API_URL = "http://backend:5000/api/v1";

// const BATCH_SIZE = 200;

// const MIN_TRIP_DURATION = 30000;

const rl = readline.createInterface({ input, output });

const waitForBackend = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            await axios.get(`${API_URL}/bikes`, {
                params: { limit: 1 },
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": process.env.BIKE_TOKEN
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
    try {
        const response = await axios.get(`${API_URL}/bikes`, {
            params: { limit: 4 },
            headers: {
                "Content-Type": "application/json",
                "x-access-token": process.env.BIKE_TOKEN
            }
        });

        const bikeData = response.data?.data[3];

        if (!bikeData) {
            console.error("No bikes found in the database.");
            process.exit(1);
        }

        const bike = new BikeBrain(bikeData._id, bikeData.id, bikeData.city_name, bikeData.location, bikeData.status);
        console.log("Loaded single bike:", bike);
        if (bike.status !== "available") {
            console.log(`Bike status is '${bike.status}. Making it available...`);
            bike.controlBike("make-available");
        }
        return bike;
    } catch (error) {
        console.error("Error loading bike from database:", error);
        process.exit(1);
        return [];
    }
};

// Load users from database
const loadUsersFromDatabase = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`, {
            headers: {
                "Content-Type": "application/json", // Optional, specify the content type
                "x-access-token": process.env.BIKE_TOKEN // Replace with your token variable
            }
        });

        const users = response.data?.data || [];

        return users.filter(user => user.role === "customer");
    } catch (error) {
        console.error("Error loading users from database:", error);
        process.exit(1);
        return [];
    }
};

const calcBatteryDepletion = (bike) => {
    let depletionRate = 0;

    switch (bike.status) {
    case "in-use":
        depletionRate = 0.2 + Math.random() * 0.1;
        break;
    case "available":
        depletionRate = 0.1 + Math.random() * 0.1;
        break;
    case "charging":
        depletionRate = -5 - Math.random() * 2;
        break;
    case "maintenance":
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

const simulateBikeUpdates = (bike, customers) => {
    if (bike.tripCurrent && bike.tripCurrent.is_active) {
        // Update bike location and handle rental end
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

        bike.updateLocation({ type: "Point", coordinates: [newLat, newLon] });
        // console.log(`Bike ${bike.id} is moving:`, bike.location);

        setTimeout(() => {
            if (bike.tripCurrent && bike.tripCurrent.is_active) {
                console.log(`Bike ${bike.id} rental ending.`);
                bike.checkAndUpdateSpeed(0);
                bike.stopRental();
                // console.log(`Local tripLog: ${bike.localTripLog}`);
            }
        }, Math.random() * 30000 + 30000); // Between 30s and 60s
    }

    const newBatteryLevel = calcBatteryDepletion(bike);
    bike.updateBattery(newBatteryLevel);

    // Attempt to start a new rental using randomization
    const shouldStartNewRental = Math.random() < 0.5;

    if (bike.status !== "maintenance" && !bike.tripCurrent?.is_active && shouldStartNewRental) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        if (customer) {
            console.log(`Bike ${bike.id} starting a new rental for customer ${customer._id}`);
            bike.startRental(customer._id);
            bike.checkAndUpdateSpeed(7);
        }
        console.log(`tripLog: ${JSON.stringify(bike.tripCurrent)}`);
    } else if (bike.status === "maintenance") {
        console.log("No bikes are available for rent.");
        console.log("Simulation ended.");
        rl.close();
        process.exit(0);
    }
};


// Simulation runs until stopped with 'exit, 'quit' or 'q'.
const startSimulation = async () => {
    try {
        await waitForBackend();

        const bike = await loadBikesFromDatabase();
        const customers = await loadUsersFromDatabase();

        console.log("Simulation started for a single bike. Type 'exit', 'quit', or 'q' to stop.");

        // Run simulation at intervals of 3 seconds
        const intervalId = setInterval(() => simulateBikeUpdates(bike, customers), 3000);

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
                break;
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
