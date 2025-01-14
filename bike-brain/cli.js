import fs from "fs";
import { exec } from "child_process";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

// List simulation scripts
const listScripts = () => {
    const files = fs.readdirSync("./");
    return files.filter(file => file.startsWith("sim"));
};

// Display menu
const showMenu = () => {
    console.log("\n--- Simulation menu ---");
    console.log("1. List available simulations");
    console.log("2. Run a simulation");
    console.log("3. Exit");
    console.log("-----------------------\n");
};

// Check for exit commands
const isExitCommand = (input) => {
    const normalized = input.trim().toLowerCase();
    return["q", "quit", "exit"].includes(normalized);
};

// Handle menu selection
const handleMenuSelection = async (option, scripts, rl) => {
    if (isExitCommand(option)) {
        console.log("Exiting...");
        process.exit(0);
    }

    switch (option) {
        case "1":
            console.log("\nAvailable simulations:");
            scripts.forEach((script, index) => {
                console.log(`${index + 1}. ${script}`);
            });
            break;

        case "2":
            if (scripts.length === 0) {
                console.log("\nNo simulations available to run.\n");
                break;
            }
            selectAndRunSimulation(scripts, rl);
            break;

        case "3":
            console.log("Exiting...");
            process.exit(0);

        default:
            console.log("\nInvalid option. Please try again.\n");
    }
    await mainMenu(scripts, rl);
};

// Prompt to choose a simulation
const selectAndRunSimulation = async (scripts, rl) => {
    console.log("\nSelect a simulation to run:");
    scripts.forEach((script, index) => {
        console.log(`${index + 1}. ${script}`);
    });

    const answer = await rl.question("\nEnter the number of the simulation (or q to quit): ");
    if (isExitCommand(answer)) {
        console.log("Exiting...");
        rl.close();
        process.exit(0);
    }

    const choice = parseInt(answer, 10);

    if (choice > 0 && choice <= scripts.length) {
        const scriptToRun = scripts[choice - 1];
        console.log(`Running: ${scriptToRun}\n`);
        exec(`node ${scriptToRun}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error: ${stderr}`);
            } else {
                console.log(stdout);
            }
        });
    } else {
        console.log("\nInvalid choice. Returning to the main menu.\n");
    }
};

// Main menu logic
const mainMenu = async(scripts, rl) => {
    showMenu();
    const option = await rl.question("Enter your choice (or q to quit): ");
    if (isExitCommand(option)) {
        console.log("Exiting...");
        rl.close();
        process.exit(0);
    }
    await handleMenuSelection(option, scripts, rl);
};

//Main function
const main = async () => {
    const scripts = listScripts();
    const rl = readline.createInterface({ input, output });

    try {
        await mainMenu(scripts, rl);
    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        rl.close();
    }
};

main();
