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

        let collectionUsers = await db.collection("users");
        let collectionBikes = await db.collection("bikes");

        return {
            collectionUsers: collectionUsers,
            collectionBikes: collectionBikes,
        };
    }
};

export default database;
