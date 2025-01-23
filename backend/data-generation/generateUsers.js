import { writeJsonFile } from './fileDirectoryUtils.js';
import { faker, fakerSV } from '@faker-js/faker';

/**
 * Generates a single user object with mock data from faker.
 * @returns {Object} - A user object.
 */
const generateUser = () => {
    const firstName = fakerSV.person.firstName();
    const lastName = fakerSV.person.lastName();
    const email = fakerSV.internet.email({ firstName, lastName }); // Random email from firstname and lastname
    const role = faker.helpers.arrayElement(['customer', 'admin', 'city_manager']); // Random role;
    const balance = role === 'customer' ? faker.number.int({ min: 0, max: 1000 }) : undefined; // Add balance placeholder if customer
    const monthly_paid = Math.random() < 0.5;

    return {
        role: role,
        firstname: firstName,
        lastname: lastName,
        email: email,
        balance: role === 'customer' ? balance : undefined, // Add balance only if 'customer'
        monthly_paid: monthly_paid
    };
};

/**
 * Generates an array of user objects.
 * @param {number} count - Number of users to generate.
 * @returns {Array<Object>} - Array of user objects.
 */
const generateUsers = (count) => {
    return Array.from({ length: count }, generateUser);
};

/**
 * Main function, generate users and write to a JSON file.
 * @param {string} filePath - Path to save the generated JSON file.
 * @param {number} count - Number of users to generate.
 */
const generateUserJsonFile = (filePath, count) => {
    const users = generateUsers(count);
    writeJsonFile(filePath, users);
    console.log(`Generated ${count} users and saved to ${filePath}`);
};

export default generateUserJsonFile;
