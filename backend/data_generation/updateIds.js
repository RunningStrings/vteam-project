import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';

/**
 * Reads JSON data from a file.
 * @param {string} filePath - Path to the JSON file.
 * @returns {Array|null} - Parsed JSON data or null.
 */
const readJsonFile = (filePath) => {
    try {
        const rawData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Error reading or parsing ${filePath}:`, error.message);
        return null;
    }
};

/**
 * Writes JSON data back to a file.
 * @param {string} filePath - Path to the JSON file.
 * @param {Array} data - JSON data to write.
 */
const writeJsonFile = (filePath, data) => {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonString, 'utf8');
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error.message);
    }
};

/**
 * Recursively gets all JSON files from a directory.
 * @param {string} dirPath - Path to the directory.
 * @returns {Array<string>} - Array of file paths.
 */
const getJsonFilesFromDirectory = (dirPath) => {
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        return entries.flatMap((entry) => {
            const fullPath = path.join(dirPath, entry.name);
            return entry.isDirectory()
             ? getJsonFilesFromDirectory(fullPath)
             : entry.name.endsWith('.json')
             ? fullPath
             : [];
        });
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error.message);
        return [];
    }
};

/**
 * Processes a single file: updates IDs if the content is an array of objects.
 * @param {string} file - File path.
 * @param {number} currentId - Starting ID.
 * @returns {number} - Updated current ID.
 */
const processFile = (file, currentId) => {
    const data = readJsonFile(file);

    if(!Array.isArray(data)) {
        console.error(`Skipping ${file}: Content is not an array.`);
        return currentId;
    }

    data.forEach((item) => {
        item.id = currentId++;
    });

    writeJsonFile(file, data);
    console.log(`Updated IDs in: ${file}`);
    return currentId;
}

/**
 * Updates IDs in JSON files.
 * @param {Array<string>} targets - Array of file or directory paths.
 */
const updateIds = (targets) => {
    let currentId = 1;

    targets.forEach((target) => {
      try {
        const stats = fs.statSync(target);

        const filesToProcess = stats.isDirectory()
          ? getJsonFilesFromDirectory(target)
          : target.endsWith('.json')
          ? [target]
          : [];
  
        filesToProcess.forEach((file) => {
          currentId = processFile(file, currentId);
        });
      } catch (error) {
        console.error(`Error processing target ${target}:`, error.message);
      }
    });

    console.log('ID update complete.');
  };

  module.exports = { updateIds };