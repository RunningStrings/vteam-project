import * as dotenv from 'dotenv';
import updateIds from './updateIds.js';
import generateUserJsonFile from './generateUsers.js';
import generateBikesJsonFile from './generateBikes.js';
import distributeBikes from './distributeBikes.js';

dotenv.config();

/**
 * Main function to generate and update data.
 */
const main = () => {
    // Get the file name and count based on NODE_ENV ('simulation' for big, anything else for small)
    const bikeFile = process.env.NODE_ENV === 'simulation'
         ? '../data-json/bikes_big.json'
         : '../data-json/bikes_small.json';

    const userFile = process.env.NODE_ENV === 'simulation'
         ? '../data-json/users_big.json'
         : '../data-json/users_small.json';

    const count = process.env.NODE_ENV === 'simulation' ? 1000 : 500;

    // Update or create Id and increment it for parkings and stations
    updateIds(['../data-json/parkings', '../data-json/stations']);

    // Generate users json
    generateUserJsonFile(userFile, count);

    // Generate bike json
    generateBikesJsonFile(bikeFile, count);
    // Update bikes Id
    updateIds([bikeFile]);

    // Distributed bikes in parkings and stations
    distributeBikes(['../data-json/parkings', '../data-json/stations'], bikeFile);

    // // Update or create Id and increment it for parkings and stations
    // updateIds(['../data-json/parkings', '../data-json/stations']);

    // // Generate 50 users
    // generateUserJsonFile('../data-json/users_small.json', 50);

    // // Generate 1000 users
    // generateUserJsonFile('../data-json/users_big.json', 1000);

    // // // Generate 500 bikes
    // generateBikesJsonFile('../data-json/bikes_small.json', 500);
    // // // Update bikes Id
    // updateIds(['../data-json/bikes_small.json']);

    // // Generate 1000 bikes
    // generateBikesJsonFile('../data-json/bikes_big.json', 1000);
    // // Update bikes Id
    // updateIds(['../data-json/bikes_big.json']);

    // // Distributed bikes in parkings and stations
    // distributeBikes(['../data-json/parkings', '../data-json/stations'], bikeFile);
};

main();
