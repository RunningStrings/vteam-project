import BikeBrain from "./bike-brain.js";

// Create a bike instance
const bike1 = new BikeBrain("bike1", "Stockholm", 59.3293, 18.0686);

// Update location, speed and battery level
setTimeout(() => {
    bike1.updateLocation(59.3300, 18.0687);
    bike1.updateSpeed(20);
    bike1.updateBattery(90);
}, 2000);

// Start a rental
setTimeout(() => {
    bike1.startRental("customer1");
}, 4000);

// Get bike data
setTimeout(() => {
    const bikeData = bike1.getBikeData();

    console.log(bikeData);
}, 8000);

// Update battery level
setTimeout(() => {
    bike1.updateBattery(50);
}, 12000);

// Update location
setTimeout(() => {
    bike1.updateLocation(59.3442, 18.0626);
}, 16000);

// Stop the rental
setTimeout(() => {
    bike1.stopRental();
}, 20000);

// Charge the bike
setTimeout(() => {
    bike1.autoCharge();
}, 24000);

// Get bike data
setTimeout(() => {
    const bikeData = bike1.getBikeData();

    console.log(bikeData);
}, 28000);

// Disconnect the bike from the server
setTimeout(() => {
    bike1.disconnect();
}, 32000);
