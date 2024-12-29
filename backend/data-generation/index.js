import updateIds from './updateIds.js';
import generateUserJsonFile from './generateUsers.js';
import generateBikesJsonFile from './generateBikes.js';
// import distributeBikes from './distributeBikes.js';

/**
 * Main function to generate and update data.
 */
const main = () => {
    // Update or create Id and increment it for parkings and stations
    updateIds(['../data-json/parkings', '../data-json/stations']);

    // Generate 50 users
    generateUserJsonFile('../data-json/users_small.json', 50)
    // Update users Id
    updateIds(['../data-json/users_small.json']);

    // Generate 1000 users
    generateUserJsonFile('../data-json/users_big.json', 1000)
    // Update users Id
    updateIds(['../data-json/users_big.json']);

    // Generate 50 bikes
    generateBikesJsonFile('../data-json/bikes_small.json', 50)
    // Update bikes Id
    updateIds(['../data-json/bikes_small.json']);

    // Generate 1000 bikes
    generateBikesJsonFile('../data-json/bikes_big.json', 1000)
    // Update bikes Id
    updateIds(['../data-json/bikes_big.json']);

    // Distributed bikes in parkings and stations
    // distributeBikes(['../data-json/parkings', '../data-json/stations'], '../data-json/bikes_small.json');
};

main();
