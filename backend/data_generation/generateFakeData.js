import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';
import { faker, fakerSV } from '@faker-js/faker';

// Constants declaration
const cities = {
    Stockholm: { lat: [59.3, 59.5], lon: [18.0, 18.2] },
    Linköping: { lat: [58.4, 58.5], lon: [15.6, 15.7] },
    Malmö: { lat: [55.5, 55.7], lon: [12.9, 13.1] },
};
const roles = ['city_manager', 'admin', 'customer'];
const status_all = ["charging", "in_use", "available", "maintenance"];

// Utility resolve data directory path
const getDataPath = () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    return path.join(__dirname, '../data_json/');
};

// Helper to generate random coordinates
const generateRandomCoordinate = (min, max) => (Math.random() * (max - min) + min);

// Helper to generate random polygon
const generateRandomPolygon = (latRange, lonRange, numPoints) => {
    const polygon = Array.from({ length: numPoints }, () => {
        const latitude = generateRandomCoordinate(latRange[0], latRange[1]);
        const longitude = generateRandomCoordinate(lonRange[0], lonRange[1]);
        return [latitude, longitude];
    });

    polygon.push(polygon[0]); // Close polygon

    return polygon;
};

/**
 * `Array.from`: Creates an array with specified length and maps over each index to generate an object.
 * The second parameter of `Array.from` is a callback function that returns an object for each bike.
 * `return` in the main function: Returns the final array of bike objects generated by `Array.from`.
 */

// Generate bikes data
const generateBikeData = (numBikes) => {
    return Array.from({ length: numBikes }, () => {
        const id = faker.number.int({ min: 1, max: 100 }); // Random bike id

        // Random city from array
        const city = faker.helpers.arrayElement(Object.keys(cities));
        const { lat, lon } = cities[city];
        // Shift coordinates
        const latitude = generateRandomCoordinate(lat[0], lat[1]);
        const longitude = generateRandomCoordinate(lon[0], lon[1]);

        const status = faker.helpers.arrayElement(status_all); // Random status from array
        const battery = faker.number.int({ min: 0, max: 100 });
        const speed = status === 'in_use' ? faker.number.int({ min: 1, max: 20 }) : 0; // Random speed if in use

        return {
            id: id,
            city_name: city,
            location: {
            type: "Point",
            coordinates: [latitude, longitude],
            },
            status: status,
            battery: battery,
            speed: speed
        };
    });
};

// Generate stations data
const generateStationsData = (numStations) => {
    return Array.from({ length: numStations }, () => {
        const id = faker.number.int({ min: 1, max: 100 }); // Random stations id
        const name = fakerSV.location.street(); // Random street name

        // Random city from array
        const city = faker.helpers.arrayElement(Object.keys(cities));
        const { lat, lon } = cities[city];
        // Shift coordinates
        const latitude = generateRandomCoordinate(lat[0], lat[1]);
        const longitude = generateRandomCoordinate(lon[0], lon[1]);

        const capacity = faker.number.int({ min: 10, max: 50 }); // Random capacity places

        return {
            id: id,
            name: name,
            city_name: city,
            location: {
            type: "Point",
            coordinates: [latitude, longitude],
            },
            bikes : [], // Placeholder for bikes at stations
            capacity: capacity
        };
    });
};

// Generate parkings data
const generateParkingsData = (numParkings) => {
    return Array.from({ length: numParkings }, () => {
        const id = faker.number.int({ min: 1, max: 100 }); // Random parkings id
        const name = fakerSV.location.street(); // Random street name

        // Random city from array
        const city = faker.helpers.arrayElement(Object.keys(cities));
        const { lat, lon } = cities[city];
        // Shift coordinates
        const latitude = generateRandomCoordinate(lat[0], lat[1]);
        const longitude = generateRandomCoordinate(lon[0], lon[1]);

        const capacity = faker.number.int({ min: 10, max: 50 }); // Random capacity places

        return {
            id: id,
            name: name,
            city_name: city,
            location: {
                type: "Point",
                coordinates: [latitude, longitude],
                },
            bikes : [], // Placeholder for bikes at parking
            capacity: capacity
        };
    });
};

// Generate users data
const generateUsersData = (numUsers) => {
    return Array.from({ length: numUsers }, () => {
        const firstName = fakerSV.person.firstName();
        const lastName = fakerSV.person.lastName();
        const email = fakerSV.internet.email({ firstName, lastName }); // Random email from firstname and lastname
        const role = faker.helpers.arrayElement(roles);
        const balance = role === 'customer' ? faker.number.int({ min: 0, max: 1000 }) : undefined; // Add balance placeholder if customer

        return {
            firstname: firstName,
            lastname: lastName,
            email: email,
            password_hash: '', // Placeholder for hashing password
            role: role,
            balance: role === 'customer' ? balance : undefined, // Add balance only if 'customer'
        };
    });
};

// Main function to clear and generate data
const clearAndGenerateData = async () => {
    const dataPath = getDataPath();

    try {
        // Clear existing data except cities.json
        const files = await fs.readdir(dataPath);
        for (const file of files) {
            if (file !== 'cities.json') {
                await fs.rm(path.join(dataPath, file), { force: true });
            }
        }

        // Generate and save data
        const bikes = generateBikeData(50);
        const stations = generateStationsData(50);
        const parkings = generateParkingsData(50);
        const users = generateUsersData(50);

        // Save data to json files
        await fs.writeFile(path.join(dataPath, 'bikes.json'), JSON.stringify(bikes, null, 2));
        await fs.writeFile(path.join(dataPath, 'charging_stations.json'), JSON.stringify(stations, null, 2));
        await fs.writeFile(path.join(dataPath, 'parking_zones.json'), JSON.stringify(parkings, null, 2));
        await fs.writeFile(path.join(dataPath, 'users.json'), JSON.stringify(users, null, 2));

        console.log('Fake data generated and saved to JSON files.');
    } catch (error) {
        console.error('Error clearing or generating data:', error.message || error);
    }
}

clearAndGenerateData();