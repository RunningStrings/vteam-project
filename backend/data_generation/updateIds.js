import { readJsonFile, writeJsonFile, getJsonFilesFromDirectory } from './fileDirectoryUtils.js';
import fs from 'node:fs'; // For filesystem operations (reading and writing)

/**
 * Processes a single file: updates IDs if the content is an array of objects.
 * @param {string} file - File path.
 * @param {number} currentId - Starting ID.
 * @returns {number} - Updated current ID.
 */
const processFile = (file, currentId) => {
    // Read and parse JSON file
    const data = readJsonFile(file);

    // If not array, skip processing
    if(!Array.isArray(data)) {
        console.error(`Skipping ${file}: Content is not an array.`);
        return currentId;
    }

    // Iterate over each item in the array and assign incremented ID
    data.forEach((item) => {
        item.id = currentId++;
    });

    writeJsonFile(file, data);
    console.log(`Updated IDs in: ${file}`);
    return currentId;
}

/**
 * Main function, updates IDs in JSON files.
 * @param {Array<string>} targets - Array of file or directory paths.
 */
const updateIds = (targets) => {
    let currentId = 1; // Initiate starting ID

    // Iterate over each target path
    targets.forEach((target) => {
      try {
        // Get target information (directory or file)
        const stats = fs.statSync(target);

        // If directory, get all JSON files inside
        // If JSON file, include it
        const filesToProcess = stats.isDirectory()
          ? getJsonFilesFromDirectory(target)
          : target.endsWith('.json')
          ? [target]
          : [];

        // Process each file and update IDs
        filesToProcess.forEach((file) => {
          currentId = processFile(file, currentId);
        });

        console.log('ID update complete.');
      } catch (error) {
        console.error(`Error processing target ${target}:`, error.message);
      }
    });
  };

export default updateIds;
