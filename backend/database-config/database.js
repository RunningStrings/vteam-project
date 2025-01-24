import * as dotenv from "dotenv";
dotenv.config();

import { MongoClient, ServerApiVersion } from "mongodb";

const database = {
    getDb: async function getDb () {
        const dsn = process.env.MONGO_DSN;

        const client = new MongoClient(dsn, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();

        const db = client.db();

        const collectionCities = await db.collection("cities");
        const collectionBikes = await db.collection("bikes");
        const collectionStations = await db.collection("stations");
        const collectionParkings = await db.collection("parkings");
        const collectionUsers = await db.collection("users");
        const collectionTrips = await db.collection("trips");

        return {
            collectionCities: collectionCities,
            collectionBikes: collectionBikes,
            collectionStations: collectionStations,
            collectionParkings: collectionParkings,
            collectionUsers: collectionUsers,
            collectionTrips: collectionTrips,
            client: client
        };
    }
};

export default database;
