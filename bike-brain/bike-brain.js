"use strict";

import io from 'socket.io-client'

class BikeBrain {
    constructor(id, lat, lon) {
        this.id = id;
        this.lat = lat;
        this.lon = lon;
        this.speed = 0;
        this.status = 'available'; // available, in-use, charging, service
        this.batteryLevel = 100;
        this.tripLog = []; // Store trip logs for sending to backend
        this.tripCurrent = null; // Store current trip

        this.socket = io('http://localhost:5000');

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
    
    // Send a message with data to the server
    sendMessage(event, data) {
        this.socket.emit(event, {
            bikeId: this.id,
            ...data,
        });
    }

    updatePosition(lat, lon) {
        this.lat = lat;
        this.lon = lon;
        this.sendMessage('update-position', {
            lat: this.lat,
            lon: this.lon
        });
    }

    updateSpeed(speed) {
        this.speed = speed;
        this.sendMessage('update-speed', {
            speed: this.speed
        });
    }

    updateBattery(batteryLevel) {
        this.batteryLevel = batteryLevel;
        this.sendMessage('update-battery', {
            batteryLevel: this.batteryLevel
        });
    }

    // Store the start time, customer ID, and position of the current 
    // trip to tripCurrent.
    startTrip(customerId) {
        const startTime = new Date();
        this.tripCurrent = {
            customerId: customerId,
            startLat: this.lat,
            startLon: this.lon,
            startTime: startTime,
        };
        console.log(`Trip started for customer ${customerId} at ${startTime}`);
    }

    // Add the stop time and position of the current trip to 
    // tripCurrent, then push tripCurrent to tripLog, emit the tripLog
    // to the server, and finally reset tripCurrent.
    stopTrip() {
        const stopTime = new Date();
        if (this.tripCurrent) {
            this.tripCurrent.stopLat = this.lat;
            this.tripCurrent.stopLon = this.lon;
            this.tripCurrent.stopTime = stopTime;
            this.tripLog.push(this.tripCurrent);
            console.log(`Trip ended for customer ${this.tripCurrent.customerId} at ${stopTime}`);
            this.sendMessage('log-trip', {
                tripLog: this.tripLog
            });
        }
        this.tripCurrent = null;
    }

    // Method for admin to control bike
    controlBike(action) {
        if (action === 'stop') {
            this.status = 'available';
            this.speed = 0;
            console.log(`Bike ${this.id} has been stopped`);
        } else if (action === 'service') {
            this.status = 'in-service';
            console.log(`Bike ${this.id} is in service mode`);
        } else if (action === 'charge') {
            this.status = 'charging';
            console.log(`Bike ${this.id} is charging`);
        }
        this.bikeLight(this.status);
    }

    // Start rental
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

    // Stop rental
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

    // Show a light indicating the bike's status
    bikeLight(status) {
        if (status === 'available') {
            console.log('green');
        } else if (status === 'charging') {
            console.log('red');
        } else if (status === 'service') {
            console.log('yellow');
        } else if (status === 'in-use') {
            console.log('blue');
        }
    }

}

export default BikeBrain;
