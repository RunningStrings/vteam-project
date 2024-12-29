import updateIds from './updateIds.js';
import generateUserJsonFile from './generateUsers.js';


/**
 * Main function to generate and update data.
 */
const main = () => {
    // Update or create Id and increment it for parkings and stations
    updateIds(['../data-json/parkings', '../data-json/stations']);

    // Generate 50 users
    generateUserJsonFile('../data-json/users.json', 50)
    // Update their id
    updateIds(['../data-json/users.json']);
};

main();
