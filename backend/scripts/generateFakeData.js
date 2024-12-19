import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';
import faker from 'faker';

const clearAndGenerateData = async () => {
    // Resolve json paths
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const dataPath = path.join(__dirname, '../data_json/');

    try {
        // Remove directory and files
        if (dataPath) {
            await fs.rm(dataPath, { recursive: true, force: true });
        }

        // Recreate directory
        await fs.mkdir(dataPath, { recursive: true});

        // Generate fake data

        // Save data to json files
        await fs.writeFile(dataPath, JSON.stringify(bikes, null, 2));

        console.log('Fake data generated and saved to JSON files.');
    } catch (error) {
        console.error('Error clearing or generating data:', error.message || error);
    }
}