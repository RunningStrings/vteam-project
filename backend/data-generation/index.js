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
    parkingsDirectoryPath = '../data-json/parkings';
    stationsDirectoryPath = '../data-json/stations';
    usersFilePath = '../data-json/users.json';
    bikesFilePath = '../data-json/bikes.json';

    // Get the file count based on NODE_ENV ('simulation' for 1000, anything else for 500)
    const count = process.env.NODE_ENV === 'simulation' ? 1000 : 500;

    // Update or create Id and increment it for parkings and stations
    updateIds([parkingsDirectoryPath, stationsDirectoryPath]);

    // Generate users json
    generateUserJsonFile(usersFilePath, count);

    // Generate bike json
    generateBikesJsonFile(bikesFilePath, count);
    // Update bikes Id
    updateIds([bikesFilePath]);

    // Distributed bikes in parkings and stations
    distributeBikes([parkingsDirectoryPath, stationsDirectoryPath], bikesFilePath);
};

main();
