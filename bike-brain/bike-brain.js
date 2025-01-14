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

        this.socket = io('http://backend:5001');

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
            console.error(`Connection error for bike ${this.id}:`, error.message);
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`Bike ${this.id} reconnected to the server after ${attemptNumber} attempts`);
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
     * Updates the bike's status and adjusts the bike light accordingly.
     * Logs the status update to the console.
     * 
     * @param {string} newStatus - The new status to set for the bike.
     */
    updateStatus(newStatus) {
        this.status = newStatus;
        this.bikeLight(newStatus);
        console.log(`Bike ${this.id} status updated to '${newStatus}'`);
    }

    /**
     * Updates the bike's location and sends it to the server.
     * @param {number} lat - The latitude of the bike's new location.
     * @param {number} lon - The longitude of the bike's new location.
     */
    updateLocation(lat, lon) {
        if (typeof lat !== 'number' || typeof lon !== 'number') {
            console.error("Invalid coordinates provided");
            return;
        }
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
     * If the bike is in use, warns at 20% and 10%, and sets the status to
     * 'maintenance' at 0%.
     * If the bike is not in use, sets the status to 'maintenance' when the 
     * battery level is 20% or lower.
     * @param {number} batteryLevel - The current battery level of the bike (1-100).
     */
    updateBattery(batteryLevel) {
        if (batteryLevel < 0 || batteryLevel > 100) {
            console.error("Battery level must be between 0 and 100");
            return;
        }
        this.batteryLevel = batteryLevel;
        this.sendMessage('update-battery', {
            batteryLevel: this.batteryLevel
        });

        // Call method to handle warnings
        this.handleBatteryWarnings();

        // Update the indicator light
        this.bikeLight(this.status);
    }

    /**
     * Handles battery warnings and status changes based on battery level.
     */
    handleBatteryWarnings() {
        if (this.batteryLevel < 20) {
            if (this.status === 'in-use') {
                if (this.batteryLevel <= 10) {
                    console.warn(`Bike ${this.id} has low battery (${this.batteryLevel}%)`);
                } else if (this.batteryLevel < 20) {
                    console.warn(`Bike ${this.id} has low battery (${this.batteryLevel})`);
                }

                // Set status to 'maintenance' when battery is drained
                if (this.batteryLevel === 0) {
                    this.updateStatus('maintenance');
                    console.log(`Bike ${this.id} in need of maintenance due to 0% battery`);
                }
            } else {
                // If bike is not in use, set status to 'maintenance' if battery level
                // is 20% or lower
                if (this.batteryLevel < 20) {
                    console.warn(`Bike ${this.id} has low battery (${this.batteryLevel}%)`);
                    this.updateStatus('maintenance');
                    console.log(`Bike ${this.id} status changed to 'maintenance' due to low battery`)
                }
            }
        }
    }

    /**
     * Starts a new trip for a customer.
     * @param {string} customerId - The ID of the customer renting the bike.
     */
    startTrip(customerId) {
        const startTime = new Date();
        this.tripCurrent = {
            customerId: customerId,
            bikeId: this.id,
            cityId: this.cityId,
            startLocation: { lat: this.location.coordinates[0], lon: this.location.coordinates[1] },
            startTime: startTime,
        };
        // this.sendMessage('log-trip)
        console.log(`Trip started for customer ${customerId} at ${startTime}`);
    }

    /**
     * Ends the current trip, stores it in a local log, sends the 
     * current trip to the server, and resets the trip state.
     */
    stopTrip() {
        const stopTime = new Date();
        if (this.tripCurrent) {
            this.tripCurrent.stopLocation = { lat: this.location.coordinates[0], lon: this.location.coordinates[1] };
            this.tripCurrent.stopTime = stopTime;
            const duration = (stopTime - this.tripCurrent.startTime) / (1000 * 60); // Duration in minutes
            this.tripCurrent.duration = duration;

            this.tripLog.push(this.tripCurrent);

            // Limit local trip log to last 100 trips
            if (this.tripLog.length > 100) {
                this.tripLog.shift(); // Remove the oldest trip
            }

            console.log(`Trip ended for customer ${this.tripCurrent.customerId} at ${stopTime}`);

            // Send only current trip to the server
            this.sendMessage('log-trip', {
                tripLog: this.tripCurrent,
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
     *                          - 'stop': Sets the bike to 'maintenance' status and resets speed to 0.
     *                            'make-available': Makes the bike available for rental.
     *                          - 'maintenance': Puts the bike in 'maintenance' mode.
     *                          - 'charge': Sets the bike to 'charging' status.
     */
    controlBike(action) {
        const validActions = ['stop', 'make-available', 'maintenance', 'charge'];
        if (!validActions.includes(action)) {
            console.error(`Invalid action '${action}' for bike ${this.id}`);
            return;
        }

        switch (action) {
            case 'stop':
                console.log(`Stopping bike ${this.id}. Speed will gradually decrease to 0.`);
                this.graduallyStopBike();
                break;
            case 'make-available':
                this.status = 'available';
                console.log(`Bike ${this.id} is now available for rental.`);
                break;
            case 'maintenance':
                this.status = 'maintenance';
                console.log(`Bike ${this.id} is in maintenance mode.`);
                break;
            case 'charge':
                this.status = 'charging';
                console.log(`Bike ${this.id} is charging`);
                break;
        }
        this.bikeLight(this.status);
    }

    /**
     * Gradually reduces the bike's speed to 0 before setting status 
     * to 'maintenance'.
     */
    graduallyStopBike() {
        const decelerationRate = 2;
        const intervalTime = 500;
        const decelerationInterval = setInterval(() => {
            if (this.speed > 0) {
                this.speed = Math.max(0, this.speed - decelerationRate);
                console.log(`Bike ${this.id} speed: ${this.speed}`);
            } else {
                clearInterval(decelerationInterval);
                this.updateStatus('maintenance');
                console.log(`Bike ${this.id} has been stopped and is now in maintenance mode.`);
                // this.bikeLight(this.status);
            }
        }, intervalTime);
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
     * If the conditions for battery level or status are not met a 
     * rental cannot be started.
     * 
     * @param {string} customerId - The ID of the customer renting the bike.
     * @returns {void}
     */
    startRental(customerId) {
        if (this.isRentalBlocked()) {
            return;
        }
        if (this.tripCurrent) {
            console.log('Trip already in progress');
            return;
        }
        this.updateStatus('in-use');
        this.startTrip(customerId);
        console.log(`Bike ${this.id} has been rented`);
        // this.bikeLight(this.status);
    }

    /**
     * Checks if the bike rental should be blocked based on status and battery level.
     * @return {boolean} - True if the rental is blocked, otherwise false.
     */
    isRentalBlocked() {
        if (this.status === 'available' && this.batteryLevel <= 20) {
            console.log(`Bike not available for rental due to low battery (${this.batteryLevel}%)`);
            return true;
        }
        if (!(this.status === 'available' || (this.status === 'charging' && this.batteryLevel >= 50))) {
            console.log('Bike not available for rental');
            return true;
        }
        return false;
    }

    /**
     * Stops the rental by changing the bike's status to 'available' and ending the current trip.
     * If the bike is not in use, the rental cannot be stopped.
     * 
     * @returns {void } Returns a message if the bike's status is not 'in-use'.
     */
    stopRental() {
        if (this.status !== 'in-use') {
            console.log('Bike not in use');
            return;
        }
        this.updateStatus('available');
        this.stopTrip();
        console.log(`Bike ${this.id} has been returned`);
        // this.bikeLight(this.status);
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
