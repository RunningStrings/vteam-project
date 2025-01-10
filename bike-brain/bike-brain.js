"use strict";

import io from 'socket.io-client'
import axios from 'axios';
import dotenv from 'dotenv';
// import haversine from './helpers.js';

dotenv.config();

const API_URL = 'http://backend:5000/api/v1';

/**
 * Represents an electric bike, tracking its state, location, and trips,
 * and handling communication with a server via socket.io.
 */
class BikeBrain {
    /**
     * Create a new BikeBrain instance.
     * @param {string} id - The bike ID.
     * @param {string} cityId - The city ID.
     * @param {Object} location - The bike's location.
     * @param {string} status - The bike's status.
     */
    constructor(mongodb_id, custom_id, city_name, location, status = 'available') {
        this._id = mongodb_id;
        this.id = custom_id;
        this.city_name = city_name;
        this.location = {type: 'Point', coordinates: location.coordinates};
        this.status = status; // available, in-use, charging, maintenance
<<<<<<< HEAD
        this.light = this.bikeLight(this.status);
=======
>>>>>>> cbe8471 (Refactor handling of location and battery in BikeBrain class)
        this.battery = 100;
        this.speed = 0;
        this.localTripLog = [];
        this.tripCurrent = null;

<<<<<<< HEAD
        this.updateInterval = null;
        this.previousLocation = null;
        this.previousSpeed = null;

        this.socket = io('http://backend:5000');
=======
        this.socket = io('http://localhost:5001');
>>>>>>> cbe8471 (Refactor handling of location and battery in BikeBrain class)

        this.socket.on('connect', () => {
            console.log(`Bike ${this.id} connected to the server`);
        });

        this.socket.on('disconnect', () => {
            console.log(`Bike ${this.id} disconnected from the server`);
        });

        // // Listen for commands from admin
        // this.socket.on('control', (data) => {
        //     this.controlBike(data.action);
        // });

        this.socket.on('connect_error', (error) => {
            console.error(`Connection error for bike ${this.id}:`, error.message);
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`Bike ${this.id} reconnected to the server after ${attemptNumber} attempts`);
        });

        const initialDelay = Math.floor(Math.random() * 5000);
        setTimeout(() => {
            this.startUpdates(20000); // Base interval for updates
        }, initialDelay);
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
            id: this.id,
            ...data,
        });
    }

    /**
     * Send a combined update for location, speed, and battery to the server.
     */
    sendCombinedUpdate() {
        const currentLocation = { ...this.location };
        const isMoving = this.detectMovement(currentLocation);

        this.updateFrequencyBasedOnMovement(isMoving);

        this.light = this.bikeLight(this.status);

        this.previousLocation = currentLocation;

        const data = {
            id: this.id,
            location: this.location,
            speed: this.speed,
            battery: this.battery,
            status: this.status,
            light: this.light,
        };

        this.sendMessage('update-bike-data', data);
        // console.log(`Bike ${this.id}: Update sent`, data);
    }

    /**
     * Detects if the bike is moving based on location.
     * @param {Object} currentLocation - The bike's current location.
     * @returns {boolean} - True if the bike is moving, otherwise false.
     */
    detectMovement(currentLocation) {
        return (
            !this.previousLocation ||
            this.previousLocation.coordinates[0] !== currentLocation.coordinates[0] ||
            this.previousLocation.coordinates[1] !== currentLocation.coordinates[1]
        );
    }

    /**
     * Adjusts update frequency based on movement.
     * @param { boolean} isMoving - Whether the bike is moving.
     */
    updateFrequencyBasedOnMovement(isMoving) {
        if (isMoving) {
            // console.log(`Bike ${this.id}: Movement detected, increasing update frequency`);
            this.startUpdates(10000);
        } else {
            // console.log(`Bike ${this.id}: No movement detected, reducing update frequency`);
            this.startUpdates(300000);
        }
    }

    /**
     * Start periodic updates.
     * @param {number} interval - Update interval in milliseconds.
     */
    startUpdates(interval) {
        if (this.updateInterval) clearInterval(this.updateInterval);

        this.updateInterval = setInterval(() => {
            this.sendCombinedUpdate();
        }, interval);

        // console.log(`Bike ${this.id}: Location updates started every ${interval / 1000} seconds`);
    }

    /**
     * Stop periodic updates.
     */
    stopUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log(`Bike ${this.id}: Updates stopped`);
        }
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
        // console.log(`Bike ${this.id} status updated to '${newStatus}'`);
    }

    /**
     * Updates the bike's location and sends it to the server.
     * @param {Object} location - The new location of the bike, containing `lat` and `lon` properties.
     */
    updateLocation(location) {
<<<<<<< HEAD
        if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
            console.error(`Invalid coordinated provided: ${JSON.stringify(location)}`);
            return;
        }

        // const [lat, lon] = location.coordinates;
        // Update the 'coordinates' array in the 'location' object
        this.location = {
            type: 'Point',
            coordinates: location.coordinates,
        };

        // Log the updated location to the console
        // console.log(`Bike ID ${this.id} updated location to:`, this.location.coordinates);
    }

    /**
     * Check if the bike's speed has changed and update accordingly
     */
    checkAndUpdateSpeed(newSpeed) {
        if (this.previousSpeed === undefined) {
            this.previousSpeed = 0;
        }

        const currentSpeed = this.speed;

        if (
            this.previousSpeed !== newSpeed
        ) {
            this.updateSpeed(newSpeed);
            this.previousSpeed = newSpeed;
        }
=======
        if (typeof location.lat !== 'number' || typeof location.lon !== 'number') {
            console.error("Invalid coordinates provided");
            return;
        }

        // Update the 'coordinates' array in the 'location' object
        this.location = {
            type: 'Point',
            coordinates: [location.lat, location.lon],
        };

        // Log the updated location to the console
        console.log(`Bike ID ${this.id} updated location to:`, this.location.coordinates, this.tripCurrent.is_active);

        // Send the updated location to the server
        this.sendMessage('update-location', {
            id: this.id,
            location: this.location,
        });
>>>>>>> cbe8471 (Refactor handling of location and battery in BikeBrain class)
    }

    /**
     * Updates the bike's speed and sends it to the server.
     * @param {number} speed - The current speed of the bike in km/h.
     */
    updateSpeed(speed) {
        this.speed = speed;
        // console.log(`Bike ${this.id}: Speed updated to`, this.speed);
    }

    /**
     * Update's the bike's battery level and sends it to the server.
     * If the bike is in use, warns at 20% and 10%, and sets the status to
     * 'maintenance' at 0%.
     * If the bike is not in use, sets the status to 'maintenance' when the 
     * battery level is 20% or lower.
     * @param {number} batteryLevel - The current battery level of the bike (1-100).
     */
    updateBattery(battery) {
        if (battery < 0 || battery > 100) {
            console.error("Battery level must be between 0 and 100");
            return;
        }
        this.battery = battery;
<<<<<<< HEAD
        // console.log(`Bike ${this.id}: Battery updated to`, this.battery);
=======
        this.sendMessage('update-battery', {
            battery: this.battery
        });
>>>>>>> cbe8471 (Refactor handling of location and battery in BikeBrain class)

        // Call method to handle warnings
        this.handleBatteryWarnings();

        // Update the indicator light
        this.bikeLight(this.status);
    }

    /**
     * Handles battery warnings and status changes based on battery level.
     */
    handleBatteryWarnings() {
        if (this.battery < 20) {
<<<<<<< HEAD
            if (this.status === 'maintenance') return;

            if (this.status === 'in-use') {
                if (this.battery <= 10) {
                    console.log(`Bike ${this.id} has low battery (${this.battery}%)`);
                } else if (this.battery < 20) {
                    console.log(`Bike ${this.id} has low battery (${this.battery})`);
=======
            if (this.status === 'in-use') {
                if (this.battery <= 10) {
                    console.warn(`Bike ${this.id} has low battery (${this.battery}%)`);
                } else if (this.battery < 20) {
                    console.warn(`Bike ${this.id} has low battery (${this.battery})`);
>>>>>>> cbe8471 (Refactor handling of location and battery in BikeBrain class)
                }

                // Set status to 'maintenance' when battery is drained
                if (this.battery === 0) {
                    this.updateStatus('maintenance');
                    console.log(`Bike ${this.id} in need of maintenance due to 0% battery`);
                }
                // If bike is not in use, set status to 'maintenance' if battery level
                // is 20% or lower
<<<<<<< HEAD
            } else if (this.battery < 20) {
                console.log(`Bike ${this.id} has low battery (${this.battery}%)`);
                this.updateStatus('maintenance');
                console.log(`Bike ${this.id} status changed to 'maintenance' due to low battery`)
=======
                if (this.battery < 20) {
                    console.warn(`Bike ${this.id} has low battery (${this.battery}%)`);
                    this.updateStatus('maintenance');
                    console.log(`Bike ${this.id} status changed to 'maintenance' due to low battery`)
                }
>>>>>>> cbe8471 (Refactor handling of location and battery in BikeBrain class)
            }
        }
    }

    /**
     * Starts a new trip for a customer.
     * @param {string} customerId - The ID of the customer renting the bike.
     */
    async startTrip(customerId) {
        console.log(`startTrip called for bike ${this.id} with status ${this.status} and battery ${this.battery}`);

        const startTime = new Date();

        this.tripCurrent = {
            // tripId: `trip-${this.id}-${startTime.getTime()}`, // Unique, local trip ID base on bike and start time.
            bikeId: this.id,
<<<<<<< HEAD
            customerId: customerId,
            // city_name: this.city_name,
            startLocation: this.location,
            startTime: startTime,
            is_active: true,
            startValidParking: Math.random() > 0.5,
            stopValidParking: null,
            // cost: "number"/null,
            // p
=======
            city_name: this.city_name,
            startLocation: this.location,
            startTime: startTime,
            is_active: true,
>>>>>>> cbe8471 (Refactor handling of location and battery in BikeBrain class)
        };
        
        // this.sendMessage('log-trip', {
        //     tripLog: this.tripCurrent,
        // });

        const data = {
            bike_id: this.id,
            customer_id: customerId,
            location: this.location,
            status: this.status,
            battery_level: this.battery,
            speed: this.speed,
            city_id: this.city_id,
            free_parking: Math.random() > 0.5,
        };
        // Error post trips: Error: city_id, location, status, speed and battery_level are required.


        try {
            // Await the axios POST request
            const response = await axios.post(`${API_URL}/trips`, data, {
                headers: {
                    'Content-Type': 'application/json', // Make sure you're sending JSON data
                    'x-access-token': process.env.BIKE_TOKEN // Optional, if needed for authentication
                },
            });

            // Handle the response after the POST request is successful
            console.log('Bike data updated successfully:', response.data);

            console.log('Server response:', response.data);
            if (response.data?.tripId) {
                this.tripCurrent.tripId = response.data.tripId;
                console.log('Trip successfully created with ID:', this.tripCurrent.tripId);
            } else {
                console.error('Trip creation failed or tripId not found in response.');
                this.tripCurrent = null;
            }
    
        } catch (error) {
            // Handle errors (e.g., network errors, server errors)
            console.error('Error sending bike data:', error.message);
            this.tripCurrent = null;
        }

        // await axios.post(`${API_URL}/trips`, { params: { limit: 1 } });

        console.log('Sending trip data to server:', this.tripCurrent);

        console.log(`Trip started for customer ${customerId} at ${startTime}`);
    }

    /**
     * Ends the current trip, stores it in a local log, sends the 
     * current trip to the server, and resets the trip state.
     */
    async stopTrip() {
        console.log('stopTrip called');
        console.log('Wake up babe, new trip ID just dropped:', this.tripCurrent.bikeId, this.tripCurrent.tripId);
        const stopTime = new Date();
<<<<<<< HEAD
=======
        if (this.tripCurrent) {
            this.tripCurrent.stopLocation = this.location;
            this.tripCurrent.stopTime = stopTime;
            const duration = (stopTime - this.tripCurrent.startTime) / (1000 * 60); // Duration in minutes
            this.tripCurrent.duration = duration;
            this.tripCurrent.is_active = false;
>>>>>>> cbe8471 (Refactor handling of location and battery in BikeBrain class)

        if (this.tripCurrent && this.tripCurrent.is_active) {
            this.tripCurrent.stopLocation = this.location;
            this.tripCurrent.stopTime = stopTime;
            // const duration = (stopTime - this.tripCurrent.startTime) / (1000 * 60); // Duration in minutes
            // this.tripCurrent.duration = duration;
            this.tripCurrent.is_active = false;

            // This line is replaced with the commented out code below when
            // frontend implements updateStopValidParking.
            this.tripCurrent.stopValidParking = Math.random() > 0.5;

            // // Verify that stopValidParking is set via the update method.
            // // Default to 'false'.
            // if (typeof this.tripCurrent.stopValidParking !== 'boolean') {
            //     this.tripCurrent.stopValidParking = false;
            // }

            this.localTripLog.push(this.tripCurrent);

            // Limit local trip log to last 100 trips
            if (this.localTripLog.length > 100) {
                this.localTripLog.shift(); // Remove the oldest trip
            }

            console.log(`Trip ended for customer ${this.tripCurrent.customerId} at ${stopTime}`, this.tripCurrent.is_active);

            const tripId = this.tripCurrent.tripId;

            if (!tripId) {
                console.error('Trip ID is missing, cannot update trip.');
                return;
            }

            const updateData = {
                end: {
                    location: this.tripCurrent.stopLocation,
                    timestamp: stopTime,
                    free_parking: this.tripCurrent.stopValidParking,
                },
                is_active: false,
                // duration: duration,
            };

            try {
                await axios.patch(`${API_URL}/trips/${tripId}`, updateData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': process.env.BIKE_TOKEN,
                    },
                });

                console.log('Trip updated successfully:', tripId);
            } catch (error) {
                console.error('Error updating trip:', error.message);
            }

            // // Send only current trip to the server
            // this.sendMessage('log-trip', {
            //     tripLog: this.tripCurrent,
            // });
        }
        this.tripCurrent = null;
    }

    /**
     * Updates the validity of parking when the current trip has ended.
     * @param {boolean} isValid - Whether the stop parking is valid.
     */
    updateStopValidParking(isValid) {
        if (!this.tripCurrent || this.tripCurrent.is_active) {
            console.error("Cannot update stop parking validity: no completed trip found.");
            return;
        }

        this.tripCurrent.stopValidParking = isValid;

        console.log(`Stop parking validity updated to ${isValid} for trip ${this.tripCurrent.tripId}`)
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
<<<<<<< HEAD
        if (this.status === 'available' && this.battery <= 20) {
            console.log(`Bike ${this.id} not available for rental due to low battery (${this.battery}%)`);
            return true;
        }
        if (!(this.status === 'available' || (this.status === 'charging' && this.battery >= 50))) {
            console.log(`Bike ${this.id} not available for rental, status ${this.status}, battery ${this.battery}.`);
=======
        if (this.status === 'available' && this.batteryLevel <= 20) {
            console.log(`Bike ${this.id} not available for rental due to low battery (${this.batteryLevel}%)`);
            return true;
        }
        if (!(this.status === 'available' || (this.status === 'charging' && this.batteryLevel >= 50))) {
            console.log(`Bike ${this.id} not available for rental`);
>>>>>>> cbe8471 (Refactor handling of location and battery in BikeBrain class)
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
<<<<<<< HEAD
            // console.log(`Bike ${this.id} not in use`);
=======
            console.log(`Bike ${this.id} not in use`);
>>>>>>> cbe8471 (Refactor handling of location and battery in BikeBrain class)
            return;
        }
        this.stopTrip();
        console.log(`Bike ${this.id} has been returned`);
        this.updateStatus('available');
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
     * @returs {string} - The light color corresponding to the status.
     */
    bikeLight(status) {
        const normalizedStatus = (status || '').trim().toLowerCase();

        const lightColors = {
            available: 'green',
            charging: 'red',
            maintenance: 'yellow',
            'in-use': 'blue',
        };

        const newLight = lightColors[normalizedStatus];
        if (newLight) {
            // console.log(`Bike ${this.id}: Light set to ${newLight}`);
            this.light = newLight;
        } else {
            console.warn(`Bike ${this.id}: Invalid status '${status}' provided, no light change.`);
        }
        return this.light;
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
            city_id: this.city_name,
            location: this.location,
            status: this.status,
            battery: this.battery,
<<<<<<< HEAD
            speed: this.speed,
            light: this.light
=======
            speed: this.speed
>>>>>>> cbe8471 (Refactor handling of location and battery in BikeBrain class)
        };
    }

}

export default BikeBrain;
