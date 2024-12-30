import BikeBrain from "./bike-brain";
import { MongoClient } from "mongodb";

// MongoDB path/database/collection
const MONGO_URI = ;
const DATABASE_NAME = ;
const COLLECTION_NAME = ;
const BATCH_SIZE = 200;

const loadBikesFromDatabase = async () => {
    const client = new MongoClient(MONGO_URI);
    const bikes = [];
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const bikesCollection = db.collection(COLLECTION_NAME);

        // Create cursor
        const cursor = bikesCollection.find();

        while (await cursor.hasNext()) {
            const batch = await cursor.next().then((doc) => {
                // Map each doc to a BikeBrain instance
                return new BikeBrain(doc.id, doc.city, doc.latitude, doc.longitude);
            });
            bikes.push(...batch);

            // Log bike creation progress
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
    bikes.forEach((bike) => {
        bike.updateLocation(
            bike.location.coordinates[0] + (Math.random() - 0.5) * 0.001,
            bike.location.coordinates[1] + (Math.random() - 0.5 * 0.001)
        );
        bike.updateSpeed(Math.floor(Math.random() * 30));
        bike.updateBattery(bike.batteryLevel - Math.random() * 5);

        if (Math.random() > 0.9) {
            bike.startRental(`customer${Math.floor(Math.random() * 1000)}`);
        }
        if (Math.random() > 0.95) {
            bike.stopRental();
        }
    });

    const activeRentals = bikes.filter((bike) => bike.status === 'in-use').length;
    console.log(`Active rentals: ${activeRentals}`);
};

const runSimulation = async () => {
    const bikes = await loadBikesFromDatabase();

    const intervalId = setInterval(() => simulateBikeUpdates(bikes), 1000);

    setTimeout(() => {
        clearInterval(intervalId);
        console.log('Simulation ended.');

        bikes.slice(0, 5).forEach((bike) => console.log(bike.id, bike.getBikeData()));

        process.exit(0);
    }, 30000);
};

runSimulation();
