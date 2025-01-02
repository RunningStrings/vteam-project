import * as dotenv from 'dotenv';
dotenv.config();

import { MongoClient, ServerApiVersion } from 'mongodb';

const database = {
    getDb: async function getDb () {
        let dsn = process.env.MONGO_DSN;

        const client = new MongoClient(dsn, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();

        const db = client.db();

        let collectionCities = await db.collection("cities");
        let collectionBikes = await db.collection("bikes");
        let collectionStations = await db.collection("stations");
        let collectionParkings = await db.collection("parkings");
        let collectionUsers = await db.collection("users");
        let collectionTrips = await db.collection("trips");

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
