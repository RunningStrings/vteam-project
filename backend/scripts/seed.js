import * as dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import fs from 'fs/promises';

dotenv.config();

// A script to populate the database
const seedData = async () => {
    const uri = 'mongodb://mongodb:27017';
    // const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    // Original citiesData
    // let citiesData = [
    //     { name: 'Stockholm', charging_stations: [], parking_zones: [], permitted_zones: [] },
    //     { name: 'Linköping', charging_stations: [], parking_zones: [], permitted_zones: [] },
    //     { name: 'Malmö', charging_stations: [], parking_zones: [], permitted_zones: [] }
    // ];

    // let bikesData = [
    //     { city_id: 'Stockholm', location: { type: 'Point', coordinates: [59.33790633117423,18.053755700927717] }, status: 'charging', battery_level: 20, speed: 0 },
    //     { city_id: 'Stockholm', location: { type: 'Point', coordinates: [59.33108277676162,18.07143682275389] }, status: 'in_use', battery_level: 30, speed: 12 },
    //     { city_id: 'Linköping', location: { type: 'Point', coordinates: [58.40981912019322,15.618860374560555] }, status: 'available', battery_level: 30, speed: 12 },
    //     { city_id: 'Malmö', location: { type: 'Point', coordinates: [55.59986846956199,13.005134779931641] }, status: 'in_use', battery_level: 30, speed: 12 },
    //     { city_id: 'Malmö', location: { type: 'Point', coordinates: [55.59677094190093,13.01388951015625] }, status: 'maintenance', battery_level: 50, speed: 0 }
    //   ];

    //   let chargingStationsData = [
    //     { city_id: 'Stockholm', location: { type: 'Point', coordinates: [59.33790633117423,18.053755700927717] }, bikes: [], capacity: 10 },
    //     { city_id: 'Linköping', location: { type: 'Point', coordinates: [58.4141407833687,15.608389030566414] }, bikes: [], capacity: 25 },
    //     { city_id: 'Linköping', location: { type: 'Point', coordinates: [58.41306744186601,15.617143760791024] }, bikes: [], capacity: 12 },
    //     { city_id: 'Malmö', location: { type: 'Point', coordinates: [55.59891074740062,13.032943922998047] }, bikes: [], capacity: 8 },
    //     { city_id: 'Malmö', location: { type: 'Point', coordinates: [55.58921704103826,12.97543736171875] }, bikes: [], capacity: 16 }
    //   ];

    //   let parkingZonesData = [
    //     { city_id: 'Stockholm', location: { type: 'Polygon', coordinates: [ [59.34084608742432,18.066412977603], [59.34088914775366,18.06584648145719], [59.34069537073425,18.06627927206204], [59.34084608742432,18.066412977603]] } },
    //     { city_id: 'Stockholm', location: { type: 'Polygon', coordinates: [ [59.33009383540676,18.07004381658114], [59.33016726740666,18.07034409689281], [59.33021133439787,18.07000680186237], [59.33009383540676,18.07004381658114] ] } },
    //     { city_id: 'Linköping', location: { type: 'Polygon', coordinates: [ [58.41061539690683,15.61766041309972], [58.41050051213356,15.61766040934009], [58.41055029045644,15.61814290956508], [58.41066900531456,15.61809905144455], [58.41061539690683,15.61766041309972] ] } },
    //     { city_id: 'Malmö', location: { type: 'Polygon', coordinates: [ [55.59448009796471,12.99746085551704], [55.59445387919217,12.99724331707766], [55.59387513032012,12.99731290270542], [55.59394732317636,12.99752715156276], [55.59448009796471,12.99746085551704] ] } },
    //     { city_id: 'Malmö', location: { type: 'Polygon', coordinates: [ [55.59217967678205,13.01171500666176], [55.59210476127265,13.01219154425889], [55.59257116128537,13.01238754730634], [55.5926422931821,13.01190178610717], [55.59217967678205,13.01171500666176] ] } }
    //   ];

    //   let usersData = [
    //     { firstname: 'Alex', lastname: 'Gadbois', email:'alex@gadbois.mail.se', password_hash: '', role: 'city_manager' },
    //     { firstname: 'Miguel', lastname: 'Finley', email:'miguel@finley.mail.se', password_hash: '', role: 'admin' },
    //     { firstname: 'Wendy', lastname: 'Kennedy', email:'wendy@kennedy.mail.se', password_hash: '', balance: 500, role: 'customer' },
    //     { firstname: 'Steven', lastname: 'Robinson', email:'steven@robinson.mail.se', password_hash: '', balance: 500, role: 'customer' },
    //     { firstname: 'Fernando', lastname: 'Crowther', email:'fernando@crowther.mail.se', password_hash: '', role: 'city_manager' },
    //   ];

    try {
        // Load external JSON data files
        const bikesJson = await fs.readFile('../data/bikes.json', 'utf-8');
        const chargingStationsJson = await fs.readFile('../data/charging_stations.json', 'utf-8');
        const citiesJson = await fs.readFile('../data/cities.json', 'utf-8');
        const parkingZonesJson = await fs.readFile('../data/parking_zones.json', 'utf-8');
        const usersJson = await fs.readFile('../data/users.json', 'utf-8');

        // parse JSON data
        const bikesData = JSON.parse(bikesJson);
        const chargingStationsData = JSON.parse(chargingStationsJson);
        const citiesData = JSON.parse(citiesJson);
        const parkingZonesData = JSON.parse(parkingZonesJson);
        const usersData = JSON.parse(usersJson);

        // Add geometry to citiesData by matching city names
        // citiesData.forEach(city => {
        //     const geoFeature = citiesGeoData.features.find(
        //         feature => feature.properties.city === city.name
        //     );
        //     if (geoFeature) {
        //         city.geometry = geoFeature.geometry; // Add geometry property
        //     }
        // });

        // console.log("Enriched citiesData:", citiesData);

        await client.connect();
        const db = client.db('bike_database');

        // Function to seed collections
        const seedCollection = async (collectionName, data) => {
            const collection = db.collection(collectionName);
            const count = await collection.countDocuments();
            if (count === 0) {
                const result = await collection.insertMany(data);
                console.log(`Inserted ${collectionName}:`, result.insertedIds);
            } else {
                console.log(`${collectionName} already has data, skipping seed`);
            }
        };

        // Seed all the collections
        await seedCollection('cities', bikesData);
        await seedCollection('bikes', chargingStationsData);
        await seedCollection('charging_stations', citiesData);
        await seedCollection('parking_zones', parkingZonesData);
        await seedCollection('users', usersData);

        console.log('Database seeded!');
    } catch (error) {
        console.error('Error seeding database:', error.message || error);
    } finally {
        await client.close();
    }
};

seedData();
