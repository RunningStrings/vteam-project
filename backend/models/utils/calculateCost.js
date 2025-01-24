/**
 * Helper function to calculate fixed, variable and total cost given duration
 * and whether start and end location are deemed as free parking.
 * @param {boolean} freeParkingStart True if free parking at start location.
 * @param {boolean} freeParkingEnd True if free parking at end location.
 * @param {number} duration The duration in milliseconds. 
 * @returns The cost object containing fixed, variable and total cost.
 */
function calculateCost(freeParkingStart, freeParkingEnd, duration) {
    let cost = {};
    cost.variable = (3 * Math.ceil(duration / 1000)); // 3 kr cost per minute('second') model
    cost.fixed = (freeParkingStart && !freeParkingEnd) ? 5 :
    (!freeParkingStart && !freeParkingEnd) ? 10 :
    (freeParkingStart && freeParkingEnd) ? 10 :
    (!freeParkingStart && freeParkingEnd) ? 20 : 0;
    cost.total = cost.variable + cost.fixed;
    return cost;
}

export default calculateCost
