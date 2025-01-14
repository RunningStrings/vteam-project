import BikeBrain from "./bike-brain.js";

const numBikes = 200;
const bikes = [];

for (let i = 1; i <= numBikes; i++) {
    bikes.push(new BikeBrain(`bike${i}`, 'Stockholm', 59.3293 + Math.random() * 0.01, 18.0686 + Math.random() * 0.01));
}

const simulateBikeUpdates = () => {
    bikes.forEach((bike) => {
        bike.updateLocation(
            bike.location.coordinates[0] + (Math.random() - 0.5) * 0.001,
            bike.location.coordinates[1] + (Math.random() - 0.5 * 0.001)
        );
        bike.updateSpeed(Math.floor(Math.random() * 30));
        bike.updateBattery(bike.batteryLevel - Math.random() * 5);

        if (Math.random() > 0.9) {
            bike.startRental(`customer${Math.floor(Math.random() * 1000)}`);
        }
        if (Math.random() > 0.95) {
            bike.stopRental();
        }
    });

    const activeRentals = bikes.filter((bike) => bike.status === 'in-use').length;
    console.log(`Active rentals: ${activeRentals}`);
};

const intervalId = setInterval(simulateBikeUpdates, 1000);

setTimeout(() => {
    clearInterval(intervalId);
    console.log('Simulation ended.');

    bikes.slice(0, 5).forEach((bike) => console.log(bike.id, bike.getBikeData()));

    process.exit(0);
}, 30000);
