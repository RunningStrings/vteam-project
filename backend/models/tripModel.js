/**
 * Model object for trips, which result from a user renting a bike.
 * Stores model functions for trips route.
 */
import database from '../database-config/database.js';
import { ObjectId } from 'mongodb';
import { createError } from './utils/createError.js'

const tripModel = {
    fetchAllTrips: async function fetchAllTrips() {
        const db = await database.getDb();

        try {
            const result = await db.collectionTrips.find().toArray();

            return result;
        } finally {
            await db.client.close();
        }
    },

    fetchTripById: async function fetchTripById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400)
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
            };
                
            const result = await db.collectionTrips.findOne(filter);

            if (!result) {
                createError(`trip with ID: ${id} cannot be found`, 404);
            }

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateCompleteTripById: async function updateCompleteTripById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        if (!body.city_id || !body.location || !body.status || !body.battery_level || !body.speed) {
            createError(`city_id, location, status, speed and battery_level are required. Use patch method
                 instead if you only want to update part of the trip resource.`, 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionTrips.findOne(filter);    

            if (!result) {
                createError(`trip with ID: ${id} cannot be found`, 404);
            }    

            const updateTrip = {
                city_id: body.city_id,
                location: body.location,
                status: body.status,
                battery_level: body.battery_level,
                speed: body.speed
            };

            result = await db.collectionTrips.updateOne(filter, { $set: updateTrip });

            // if (result.modifiedCount !== 1) {
            //     createError(`no update possible with the given information for trip with ID: ${id}.
            //         Make sure information you provide is new.`, 400);
            // }

            result = await db.collectionTrips.findOne(filter);

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateTripById: async function updateTripById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionTrips.findOne(filter);

            if (!result) {
                createError(`trip with ID: ${id} cannot be found`, 404);
            }

            const allowedProperties = ["city_id", "location", "status",
                 "battery_level", "speed"];
            const reqProperties = Object.keys(body);
            const isInvalidUpdate = reqProperties.some(property =>
                !allowedProperties.includes(property));

           if (isInvalidUpdate) {
               createError(`invalid update property key. This API only allow
                    updates of already existing properties.`, 400);
           }

            result = await db.collectionTrips.updateOne(filter, { $set: body });

            // if (result.modifiedCount !== 1) {
            //     createError(`no update possible with the given information for trip with ID: ${id}.
            //         Make sure information you provide is new.`, 400);
            // }

            return;
        } finally {
            await db.client.close();
        }
    },

    deleteTripById: async function deleteTripById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionTrips.findOne(filter);

            if (!result) {
                createError(`trip with ID: ${id} cannot be found`, 404);
            }

            result = await db.collectionTrips.deleteOne(filter);

            if (result.deletedCount !== 1) {
                createError(`fail, no delete possible with the given information for trip with ID: ${id}.`, 400);
            }

            return;
        } finally {
            await db.client.close();
        }
    },

    createTrip: async function createTrip(body) {
        if (!body.city_id || !body.location || !body.status || !body.battery_level || !body.speed) {
            createError("city_id, location, status, speed and battery_level are required.", 400);
        }

        const db = await database.getDb();

        try {
            const newTrip = {
                bike_id: body.bike_id,
                customer_id: body.customer_id,
                // start: { location: body.location, }
                location: body.location,
                status: body.status,
                battery_level: body.battery_level,
                speed: body.speed
            };

            // const status = newTrip.status;
            // const duplicateTrip = await db.collectionTrips.findOne({status});

            // if (duplicateTrip) {
            //     createError("Trip with this status already exists.", 400)
            // }

            const result = await db.collectionTrips.insertOne(newTrip);
            
            return result;
        } finally {
            await db.client.close();
        }
    }
};

export default tripModel;
