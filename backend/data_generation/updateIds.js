import path from 'node:path'; // For working with file and directory
import fs from 'node:fs'; // For filesystem operations (reading and writing)

/**
 * Reads JSON data from a file.
 * @param {string} filePath - Path to the JSON file.
 * @returns {Array|null} - Parsed JSON data or null.
 */
const readJsonFile = (filePath) => {
    try {
        // Synchronously read the file content as UTF-8 string
        const rawData = fs.readFileSync(filePath, 'utf8');
        // Parse JSON string into Javascript object and return it
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
        // Convert Javascript object/array into JSON string pretty print
        const jsonString = JSON.stringify(data, null, 2);
        // Synchronously write JSON string to specified file
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
        // Read directory entries (files/subdirectories) with types
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        // Iterate over directory entries and process
        return entries.flatMap((entry) => {
            // Construct full path for entry
            const fullPath = path.join(dirPath, entry.name);
            // If entry is directory, recursively call this function
            // If entry is file, include in result
            return entry.isDirectory()
             ? getJsonFilesFromDirectory(fullPath)
             : entry.name.endsWith('.json')
             ? fullPath
             : []; // Exclude non-JSON file
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
