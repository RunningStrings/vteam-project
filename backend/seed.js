import * as dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from "mongodb";

// A script to populate the database
const seedData = async () => {
    // const uri = 'mongodb://mongodb:27017';
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    const citiesData = [
        { name: 'Stockholm', charging_stations: [], parking_zones: [], permitted_zones: [] },
        { name: 'Linköping', charging_stations: [], parking_zones: [], permitted_zones: [] },
        { name: 'Malmö', charging_stations: [], parking_zones: [], permitted_zones: [] }
      ];

      const bikesData = [
        { city_id: 'stock', location: { type: 'Point', coordinates: [18.053755700927717,59.33790633117423] }, status: 'charging', battery_level: 20, speed: 0 },
        { city_id: 'stoc', location: { type: 'Point', coordinates: [18.07143682275389,59.33108277676162] }, status: 'in_use', battery_level: 30, speed: 12 },
        { city_id: 'lin', location: { type: 'Point', coordinates: [15.618860374560555,58.40981912019322] }, status: 'available', battery_level: 30, speed: 12 },
        { city_id: 'malmö', location: { type: 'Point', coordinates: [13.005134779931641,55.59986846956199] }, status: 'in_use', battery_level: 30, speed: 12 },
        { city_id: 'malmö', location: { type: 'Point', coordinates: [13.01388951015625,55.59677094190093,] }, status: 'maintenance', battery_level: 50, speed: 0 }
      ];

      const chargingStationsData = [
        { city_id: 'stock', location: { type: 'Point', coordinates: [18.053755700927717,59.33790633117423] }, bikes: [], capacity: 10 },
        { city_id: 'lin', location: { type: 'Point', coordinates: [15.608389030566414,58.4141407833687] }, bikes: [], capacity: 25 },
        { city_id: 'lin', location: { type: 'Point', coordinates: [15.617143760791024,58.41306744186601,] }, bikes: [], capacity: 12 },
        { city_id: 'malmö', location: { type: 'Point', coordinates: [13.032943922998047,55.59891074740062] }, bikes: [], capacity: 8 },
        { city_id: 'malmö', location: { type: 'Point', coordinates: [12.97543736171875,55.58921704103826] }, bikes: [], capacity: 16 }
      ];

      const parkingZonesData = [
        { city_id: 'stock', location: { type: 'Polygon', coordinates: [ [18.066412977603,59.34084608742432], [18.06584648145719,59.34088914775366], [18.06627927206204,59.34069537073425], [18.066412977603,59.34084608742432]] } },
        { city_id: 'stock', location: { type: 'Polygon', coordinates: [ [18.07004381658114,59.33009383540676], [18.07034409689281,59.33016726740666], [18.07000680186237,59.33021133439787], [18.07004381658114,59.33009383540676] ] } },
        { city_id: 'lin', location: { type: 'Polygon', coordinates: [ [15.61766041309972,58.41061539690683], [15.61766040934009,58.41050051213356], [15.61814290956508,58.41055029045644], [15.61809905144455,58.41066900531456], [15.61766041309972,58.41061539690683] ] } },
        { city_id: 'malmö', location: { type: 'Polygon', coordinates: [ [12.99746085551704,55.59448009796471], [12.99724331707766,55.59445387919217], [12.99731290270542,55.59387513032012], [12.99752715156276,55.59394732317636], [12.99746085551704,55.59448009796471] ] } },
        { city_id: 'malmö', location: { type: 'Polygon', coordinates: [ [13.01171500666176,55.59217967678205], [13.01219154425889,55.59210476127265], [13.01238754730634,55.59257116128537], [13.01190178610717,55.5926422931821], [13.01171500666176,55.59217967678205] ] } }
      ];

      const usersData = [
        { firstname: 'Alex', lastname: 'Gadbois', email:'alex@gadbois.mail.se', password_hash: '', role: 'city_manager' },
        { firstname: 'Miguel', lastname: 'Finley', email:'miguel@finley.mail.se', password_hash: '', role: 'admin' },
        { firstname: 'Wendy', lastname: 'Kennedy', email:'wendy@kennedy.mail.se', password_hash: '', balance: 500, role: 'customer' },
        { firstname: 'Steven', lastname: 'Robinson', email:'steven@robinson.mail.se', password_hash: '', balance: 500, role: 'customer' },
        { firstname: 'Fernando', lastname: 'Crowther', email:'fernando@crowther.mail.se', password_hash: '', role: 'city_manager' },
      ];
    

    try {
        await client.connect();
        const db = client.db('bike_database');

        // Seed cities
        const cities = db.collection('cities');
        // Check if the collection has data
        const citiesCount = await cities.countDocuments();
        // If the collection is empty, insert data
        if (usersCount === 0) {
            await users.insertMany(citiesData);
            console.log('Inserted cities:', cities.insertedIds);
        } else {
            console.log('Cities already has data, skipping seed');
        }



        console.log('Database seeded!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
    }
};

seedData();
