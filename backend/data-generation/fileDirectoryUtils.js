import path from 'node:path'; // For working with file and directory
import fs from 'node:fs'; // For filesystem operations (reading and writing)

/**
 * Reads JSON data from a file.
 * @param {string} filePath - Path to the JSON file.
 * @returns {Array|null} - Parsed JSON data or null.
 */
const readJsonFile = (filePath) => {
    try {
        // Synchronously read the file content
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
 * Get all data from target paths (files or directories).
 * @param {Array<string>} targets - Array of file or directory paths.
 * @returns {Array<{file: string, data: Array}>} - Array of objects containing file path and data.
 */
const getAllDataFromTargets = (targets) => {
    let allData = [];
  
    targets.forEach((target) => {
      try {
        const stats = fs.statSync(target);
        const filesToProcess = stats.isDirectory()
          ? getJsonFilesFromDirectory(target) // Get all JSON files in directory
          : target.endsWith('.json')
          ? [target] // Single JSON file
          : [];
  
        filesToProcess.forEach((file) => {
          const data = readJsonFile(file);
          if (Array.isArray(data)) {
            allData.push({ file, data });
          } else {
            console.error(`Skipping ${file}: Content is not an array.`);
          }
        });
      } catch (error) {
        console.error(`Error processing target ${target}:`, error.message);
      }
    });
  
    return allData;
  };

export { readJsonFile, writeJsonFile, getJsonFilesFromDirectory, getAllDataFromTargets };
