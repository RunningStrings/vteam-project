import updateIds from './updateIds.js';

/**
 * Main function to generate and update data.
 */
const main = () => {
    // Update or create Id and increment it for parkings and stations
    updateIds(['../data_json/parkings', '../data_json/stations']);
};

main();
