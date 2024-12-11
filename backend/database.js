import * as dotenv from 'dotenv';
dotenv.config();

import { MongoClient, ServerApiVersion } from 'mongodb';

const database = {
    getDb: async function getDb () {
        // Lägg eventuellt databasnamnet i .env fil?
        // let dsn = `mongodb://mongodb:27017/bike_database`;
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
        let collectionChargingStations = await db.collection("charging_stations");
        let collectionParkingZones = await db.collection("parking_zones");
        let collectionUsers = await db.collection("users");
        let collectionTrips = await db.collection("trips");
        let collectionGeoZones = await db.collection("geo_zones");

        return {
            collectionCities: collectionCities,
            collectionBikes: collectionBikes,
            collectionChargingStations: collectionChargingStations,
            collectionParkingZones: collectionParkingZones,
            collectionUsers: collectionUsers,
            collectionTrips: collectionTrips,
            collectionGeoZones: collectionGeoZones
        };
    }
};

export default database;
