import { readJsonFile, writeJsonFile, getAllDataFromTargets } from './fileDirectoryUtils.js';
import fs from 'node:fs';

// Helper function to get all JSON data from files in directories or specific JSON files
// const getAllDataFromTargets = (targets) => {
//   let allData = [];

//   targets.forEach((target) => {
//     try {
//       const stats = fs.statSync(target);
//       const filesToProcess = stats.isDirectory()
//         ? getJsonFilesFromDirectory(target) // Get all JSON files in directory
//         : target.endsWith('.json')
//         ? [target] // Single JSON file
//         : [];

//       filesToProcess.forEach((file) => {
//         const data = readJsonFile(file);
//         if (Array.isArray(data)) {
//           allData.push({ file, data });
//         } else {
//           console.error(`Skipping ${file}: Content is not an array.`);
//         }
//       });
//     } catch (error) {
//       console.error(`Error processing target ${target}:`, error.message);
//     }
//   });

//   return allData;
// };

/**
 * Helper function to assign bikes to parking stations
 * This function ensures that each parking station gets at least one bike.
 *
 * @param {Array} allData - List of parking stations with their data.
 * @param {Array} bikes - List of all bikes.
 * @param {Array} bikeIds - List of bike IDs to be assigned to stations.
 */
const assignBikesToStations = (allData, bikes, bikeIds) => {
  // First pass: Ensure each parking/station gets at least one bike
  allData.forEach(({ data }) => {
    data.forEach((item) => {
        item.bikes = [];

        if (bikeIds.length > 0 && item.bikes.length === 0) {
            const bikeToAssign = bikeIds.shift(); // Take one bike
            item.bikes.push(bikeToAssign); // Assign the bike

            // Update bike location
            const bike = bikes.find((b) => b.id === bikeToAssign);
            if (bike) {
                bike.location.coordinates = item.location.coordinates; // Assign station's location coordinates
                bike.status = 'parked'; // Update bike status to parked
            }
        }
    });
  });
};

/**
 * Helper function to distribute remaining bikes evenly across stations
 * This function distributes any leftover bikes evenly across all stations.
 *
 * @param {Array} allData - List of parking stations with their data.
 * @param {Array} bikes - List of all bikes.
 * @param {Array} bikeIds - List of remaining bike IDs to be distributed across stations.
 */
const distributeRemainingBikes = (allData, bikes, bikeIds) => {
    let index = 0; // Track the current index for round-robin distribution

    // Second pass: Distribute remaining bikes evenly across all stations
    while (bikeIds.length > 0) {
    const { data } = allData[index]; // Get the current station/parking data
    let bikeAssignedInCurrentFile = false; // Flag to track if any bike was assigned in this file

    // Iterate over all items in the current data array (stations/parkings)
    for (const item of data) {
        if (item.bikes.length < item.capacity) { // Check if the current item has available capacity
            const bikeToAssign = bikeIds.shift(); // Take one bike
            item.bikes.push(bikeToAssign); // Assign the bike

            // Update bike location
            const bike = bikes.find((b) => b.id === bikeToAssign);
            if (bike) {
                bike.location.coordinates = item.location.coordinates; // Assign station's location coordinates
                bike.status = 'parked'; // Update bike status to parked
            }

            bikeAssignedInCurrentFile = true; // Mark that a bike was assigned in this file
            if (bikeIds.length === 0) break; // Exit the loop if no bikes are left to assign
        }
    }

    // Move to the next file in round-robin fashion if bikes were assigned in the current file
    if (!bikeAssignedInCurrentFile || bikeIds.length > 0) {
        index = (index + 1) % allData.length; // Move to the next file in round-robin fashion
    }

    // If no bikes left to distribute, break the loop
    if (bikeIds.length === 0) break;
    }
};

/**
 * Main function to distribute bikes across stations:
 * - First assigns at least one bike to each station.
 * - Then distributes the remaining bikes evenly across stations.
 *
 * @param {Array} targets - List of target directories or files containing parking station data.
 * @param {string} bikesFile - Path to the file containing bike information.
 */
const distributeBikes = (targets, bikesFile) => {
    const bikes = readJsonFile(bikesFile);
    let bikeIds = bikes.map((bike) => bike.id); // Extract bike IDs

    // Collect data from all targets (directories or files)
    const allData = getAllDataFromTargets(targets);

    // First pass: Ensure each parking/station gets at least one bike
    assignBikesToStations(allData, bikes, bikeIds);

    // Second pass: Distribute remaining bikes evenly
    distributeRemainingBikes(allData, bikes, bikeIds);

    // Write updated data back to their respective files
    allData.forEach(({ file, data }) => {
        writeJsonFile(file, data);
        console.log(`Updated parking/station data in: ${file}`);
    });

    // Update bike locations in the bikes file
    writeJsonFile(bikesFile, bikes); // Save updated bike data
    console.log('Bike distribution complete.');
};

export default distributeBikes;
