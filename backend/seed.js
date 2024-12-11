import * as dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from "mongodb";

// A script to populate the database
const seedData = async () => {
    // const uri = 'mongodb://mongodb:27017';
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('bike_database');

        // Seed users
        const users = db.collection('users');
        // Check if the collection has data
        const usersCount = await users.countDocuments();
        // If the collection is empty, insert data
        if (usersCount === 0) {
            await users.insertMany([
                { name: 'Knatte', email: 'knatte@mail.com' },
                { name: 'Fnatte', email: 'fnatte@mail.com' },
                { name: 'Tjatte', email: 'tjatte@mail.com' },
            ]);
            console.log('Users seeded!');
        } else {
            console.log('Users already has data, skipping seed');
        }

        // Seed bikes
        const bikes = db.collection('bikes');
        // Check if the collection has data
        const bikesCount = await bikes.countDocuments();
        // If the collection is empty, insert data
        if (bikesCount === 0) {
            await bikes.insertMany([
                { model: 'Silverpilen' },
                { model: 'NV Jet Crosser' },
                { model: 'Novolette' },
            ]);
            console.log('Bikes seeded!');
        } else {
            console.log('Bikes already has data, skipping seed');
        }

        console.log('Database seeded!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
    }
};

seedData();
