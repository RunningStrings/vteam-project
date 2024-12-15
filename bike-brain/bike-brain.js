"use strict";

import io from 'socket.io-client'

/**
 * Represents an electric bike, tracking its state, location, and trips,
 * and handling communication with a server via socket.io.
 */
class BikeBrain {
    /**
     * Create a new BikeBrain instance.
     * @param {string} id - The bike ID.
     * @param {string} cityId - The city ID.
     * @param {number} lat - The bike's starting latitude.
     * @param {number} lon - The bike's starting longitude.
     */
    constructor(id, cityId, lat, lon) {
        this.id = id;
        this.cityId = cityId;
        this.location = {type: 'Point', coordinates: [lat, lon] };
        this.status = 'available'; // available, in-use, charging, maintenance
        this.batteryLevel = 100;
        this.speed = 0;
        this.tripLog = [];
        this.tripCurrent = null;

        this.socket = io('http://localhost:5001');

        this.socket.on('connect', () => {
            console.log(`Bike ${this.id} connected to the server`);
        });

        this.socket.on('disconnect', () => {
            console.log(`Bike ${this.id} disconnected from the server`);
        });

        // Listen for commands from admin
        this.socket.on('control', (data) => {
            this.controlBike(data.action);
        });

        this.socket.on('connect_error', (error) => {
            console.error(`Connection error for bike ${this.id}:`, error);
        });
    }

    /**
     * Disconnects the bike from the server.
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
    
    /**
     * Send a message with data to the server.
     * @param {string} event - The event name.
     * @param {Object} data - The data to send.
     */
    sendMessage(event, data) {
        this.socket.emit(event, {
            bikeId: this.id,
            ...data,
        });
    }

    /**
     * Updates the bike's location and sends it to the server.
     * @param {number} lat - The latitude of the bike's new location.
     * @param {number} lon - The longitude of the bike's new location.
     */
    updateLocation(lat, lon) {
        this.location.coordinates = [lat, lon];
        this.sendMessage('update-location', {
            location: this.location
        });
    }

    /**
     * Updates the bike's speed and sends it to the server.
     * @param {number} speed - The current speed of the bike in km/h.
     */
    updateSpeed(speed) {
        this.speed = speed;
        this.sendMessage('update-speed', {
            speed: this.speed
        });
    }

    /**
     * Update's the bike's battery level and sends it to the server.
     * @param {number} batteryLevel - The current battery level of the bike (1-100).
     */
    updateBattery(batteryLevel) {
        this.batteryLevel = batteryLevel;
        this.sendMessage('update-battery', {
            batteryLevel: this.batteryLevel
        });
    }

    /**
     * Starts a new trip for a customer.
     * @param {string} customerId - The ID of the customer renting the bike.
     */
    startTrip(customerId) {
        const startTime = new Date();
        this.tripCurrent = {
            customerId: customerId,
            startLocation: { lat: this.location.coordinates[0], lon: this.location.coordinates[1] },
            startTime: startTime,
        };
        console.log(`Trip started for customer ${customerId} at ${startTime}`);
    }

    /**
     * Ends the current trip, logs it, sends the log to the server, and resets the trip state.
     */
    stopTrip() {
        const stopTime = new Date();
        if (this.tripCurrent) {
            this.tripCurrent.stopLocation = { lat: this.location.coordinates[0], lon: this.location.coordinates[1] };
            this.tripCurrent.stopTime = stopTime;
            this.tripLog.push(this.tripCurrent);
            console.log(`Trip ended for customer ${this.tripCurrent.customerId} at ${stopTime}`);
            this.sendMessage('log-trip', {
                tripLog: this.tripLog
            });
        }
        this.tripCurrent = null;
    }

    /**
     * Updates the bike's status based on the action selected by admin.
     * Depending on the action, the bike's status and other properties (e.g., speed)
     * are modified.
     * Also triggers an indicator light via the `bikeLight` method.
     * 
     * @param {string} action - The action selected by admin.
     *                          Valid actions:
     *                          - 'stop': Sets the bike to 'available' status and resets speed to 0.
     *                          - 'maintenance': Puts the bike in 'maintenance' mode.
     *                          - 'charge': Sets the bike to 'charging' status.
     */
    controlBike(action) {
        if (action === 'stop') {
            this.status = 'available';
            this.speed = 0;
            console.log(`Bike ${this.id} has been stopped`);
        } else if (action === 'maintenance') {
            this.status = 'maintenance';
            console.log(`Bike ${this.id} is in maintenance mode`);
        } else if (action === 'charge') {
            this.status = 'charging';
            console.log(`Bike ${this.id} is charging`);
        }
        this.bikeLight(this.status);
    }

    /**
     * Automatically triggers when the bike is returned to a charging station.
     */
    autoCharge() {
        console.log(`Bike ${this.id} is being charged at a charging station`);
        this.controlBike('charge');
    }

    /**
     * Starts a rental by changing the bike's status to 'in-use' and initiating a trip.
     * If the bike is not available, the rental cannot be started.
     * 
     * @param {string} customerId - The ID of the customer renting the bike.
     * @returns Returns a message if the bike's status is not 'available'.
     */
    startRental(customerId) {
        if (this.status !== 'available') {
            console.log('Bike not available for rental');
            return;
        }
        this.status = 'in-use';
        this.startTrip(customerId);
        console.log(`Bike ${this.id} has been rented`);
        this.bikeLight(this.status);
    }

    /**
     * Stops the rental by changing the bike's status to 'available' and ending the current trip.
     * If the bike is not in use, the rental cannot be stopped.
     * 
     * @returns Returns a message if the bike's status is not 'in-use'.
     */
    stopRental() {
        if (this.status !== 'in-use') {
            console.log('Bike not in use');
            return;
        }
        this.status = 'available';
        this.stopTrip();
        console.log(`Bike ${this.id} has been returned`);
        this.bikeLight(this.status);
    }

    /**
     * Displays a colored light (logs a color to the console) 
     * indicating the bike's status.
     * 
     * @param {string} status - The current status of the bike.
     *                          Each status corresponds with a color:
     *                          - 'available' = green
     *                          - 'charging' = red
     *                          - 'maintenance' = yellow
     *                          - 'in-use' = blue
     */
    bikeLight(status) {
        if (status === 'available') {
            console.log('green');
        } else if (status === 'charging') {
            console.log('red');
        } else if (status === 'maintenance') {
            console.log('yellow');
        } else if (status === 'in-use') {
            console.log('blue');
        }
    }

    /**
     * Retrieves the current data of the bike.
     * Returns an object containing the bike's city ID, location, status, 
     * battery level, and speed.
     * @returns {Object}    An object containing the bike's data:
     *                      - {number} city_id - The ID of the city the bike is located in.
     *                      - {Object} location - The bike's location.
     *                      - {string} status - The current status of the bike.
     *                      - {number} battery_level - The current battery level.
     *                      - {number} speed - The current speed of the bike
     */
    getBikeData() {
        return {
            city_id: this.cityId,
            location: this.location,
            status: this.status,
            battery_level: this.batteryLevel,
            speed: this.speed
        };
    }

}

export default BikeBrain;
