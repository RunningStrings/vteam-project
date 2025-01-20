import { writeJsonFile } from './fileDirectoryUtils.js';
import { faker } from '@faker-js/faker';

/**
 * Generates a single bike object with mock data from faker.
 * @returns {Object} - A bike object.
 */
const generateBike = () => {
    // const city = faker.helpers.arrayElement(['Stockholm', 'Linköping', 'Malmö']);
    const status = faker.helpers.arrayElement(["available", "maintenance"]); // Random status from array
    const battery = faker.number.int({ min: 0, max: 100 });
    const speed = status === 'in_use' ? faker.number.int({ min: 1, max: 20 }) : 0; // Random speed if in use

    return {
        id: 0,
        city_name: '',
        location: {
            type: "Point",
            coordinates: []
        },
        status: status,
        battery: battery,
        speed: speed
    };
};

/**
 * Generates an array of bikes objects.
 * @param {number} count - Number of bikes to generate.
 * @returns {Array<Object>} - Array of bike objects.
 */
const generateBikes = (count) => {
    return Array.from({ length: count }, generateBike);
};

/**
 * Main function, generate bikes and write to a JSON file.
 * @param {string} filePath - Path to save the generated JSON file.
 * @param {number} count - Number of bikes to generate.
 */
const generateBikesJsonFile = (filePath, count) => {
    const bikes = generateBikes(count);
    writeJsonFile(filePath, bikes);
    console.log(`Generated ${count} bikes and saved to ${filePath}`);
};

export default generateBikesJsonFile;
