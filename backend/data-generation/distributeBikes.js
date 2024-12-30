import { readJsonFile, writeJsonFile, getAllDataFromTargets } from './fileDirectoryUtils.js';

/**
 * Assign a bike to a station and update the bike's location.
 * @param {Object} item - The station/parking object to assign the bike to.
 * @param {string} bikeId - The bike ID to assign.
 * @param {Array} bikes - The list of all bikes.
 */
const assignBike = (item, bikeId, bikes) => {
    item.bikes.push(bikeId); // Assign the bike
    const bike = bikes.find((b) => b.id === bikeId);
    if (bike) {
        bike.location.coordinates = item.location.coordinates; // Update bike location
    }
};

/**
 * Assign bikes to parking stations, ensuring each parking station gets at least one bike.
 * @param {Array} allData - List of parkings and stations with their data.
 * @param {Array} bikes - List of all bikes.
 * @param {Array} bikeIds - List of bike IDs to be assigned to stations.
 */
const assignBikesToStations = (allData, bikes, bikeIds) => {
    allData.forEach(({ data }) => {
        data.forEach((item) => {
            item.bikes = []; // Reset bikes array
            if (bikeIds.length > 0 && item.bikes.length === 0) {
                const bikeToAssign = bikeIds.shift(); // Take one bike
                assignBike(item, bikeToAssign, bikes); // Assign the bike
            }
        });
    });
};

/**
 * Distribute remaining bikes evenly across stations (round-robin).
 * @param {Array} allData - List of parkings and stations with their data.
 * @param {Array} bikes - List of all bikes.
 * @param {Array} bikeIds - List of remaining bike IDs to be distributed.
 */
const distributeRemainingBikes = (allData, bikes, bikeIds) => {
    let index = 0; // Track the current index for distribution

    while (bikeIds.length > 0) {
        const { data } = allData[index]; // Get the current station/parking data
        let bikeAssignedInCurrentFile = false;

        // Iterate over all items in the current data array (stations/parkings)
        for (const item of data) {
            if (item.bikes.length < item.capacity && bikeIds.length > 0) {
                const bikeToAssign = bikeIds.shift(); // Take one bike
                assignBike(item, bikeToAssign, bikes); // Assign the bike
                bikeAssignedInCurrentFile = true;
                if (bikeIds.length === 0) break; // Exit if no bikes left
            }
        }

        // Move to the next file in round-robin fashion
        if (!bikeAssignedInCurrentFile || bikeIds.length > 0) {
            index = (index + 1) % allData.length;
        }

        if (bikeIds.length === 0) break; // Exit the loop if no bikes left
    }
};

/**
 * Main function to distribute bikes across stations.
 * @param {Array} targets - List of target directories or files containing parkings and station data.
 * @param {string} bikesFile - Path to the file containing bike information.
 */
const distributeBikes = (targets, bikesFile) => {
    const bikes = readJsonFile(bikesFile);
    let bikeIds = bikes.map((bike) => bike.id); // Extract bike IDs

    // Collect data from all targets (directories or files)
    const allData = getAllDataFromTargets(targets);

    // Assign at least one bike to each station
    assignBikesToStations(allData, bikes, bikeIds);

    // Distribute remaining bikes evenly
    distributeRemainingBikes(allData, bikes, bikeIds);

    // Write updated data back to their respective files
    allData.forEach(({ file, data }) => {
        writeJsonFile(file, data);
        console.log(`Updated parking/station data in: ${file}`);
    });

    // Update bike locations in the bikes file
    writeJsonFile(bikesFile, bikes);
    console.log('Bike distribution complete.');
};

export default distributeBikes;
