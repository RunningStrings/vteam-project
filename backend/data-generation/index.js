import updateIds from './updateIds.js';
import generateUserJsonFile from './generateUsers.js';

/**
 * Main function to generate and update data.
 */
const main = () => {
    // Update or create Id and increment it for parkings and stations
    updateIds(['../data-json/parkings', '../data-json/stations']);

    // Generate 50 users
    generateUserJsonFile('../data-json/users_small.json', 50)
    // Update their id
    updateIds(['../data-json/users_small.json']);

    // Generate 1000 users
    generateUserJsonFile('../data-json/users_big.json', 1000)
    // Update their id
    updateIds(['../data-json/users_big.json']);
};

main();
