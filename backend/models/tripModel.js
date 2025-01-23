/**
 * Model object for trips, which result from a user renting a bike.
 * Stores model functions for trips route.
 */
import database from '../database-config/database.js';
import { ObjectId, Timestamp } from 'mongodb';
import { createError } from './utils/createError.js'
import cost from './utils/calculateCost.js'

const tripModel = {
    fetchAllTrips: async function fetchAllTrips(query) {
        const db = await database.getDb();

        try {
            const { customer_id } = query;
            const filter = customer_id ? { customer_id: { $regex: new RegExp(customer_id, 'i') } } : {};
            const result = await db.collectionTrips.find(filter).toArray();

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

            // Add properties "end" and "is_active"
            const timeNow = new Date().getTime();
            const allowedProperties = [
                "city_id",
                "location",
                "status",
                "battery_level",
                "speed",
                "end",
                "is_active",
            ];
            const reqProperties = Object.keys(body);
            const isInvalidUpdate = reqProperties.some(property =>
                !allowedProperties.includes(property));

            if (isInvalidUpdate) {
                createError(`invalid update property key. This API only allow
                        updates of already existing properties.`, 400);
            }

            // Add end timestamp
            if (body.end) {
                body.end.timestamp = timeNow;
                const calculatedCost = cost(result.free_parking, body.end.free_parking,
                     (timeNow - result.start.timestamp));
                body.variable_cost = calculatedCost?.variable || null,
                body.fixed_cost = calculatedCost?.fixed || null,
                body.cost = calculatedCost?.total || null
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
        // if (!body.bike_id || !body.customer_id || !body.location) {
        //     createError("city_id, location and bike_id are required.", 400);
        // }

        const db = await database.getDb();

        try {
            const timeNow = new Date().getTime();
            let futureTime;
            let calculatedCost;
            if (typeof body.end?.minutes !== 'undefined' && typeof body.free_parking !== 'undefined' &&
                typeof body.end?.free_parking !== 'undefined') {
                    const duration = body.end.minutes * 1000;
                    futureTime = (body.timestamp || timeNow) + duration;
                    calculatedCost = cost(body.free_parking, body.end.free_parking, duration);
                }
            const newTrip = {
                bike_id: body.bike_id,
                customer_id: body.customer_id,
                start: { location: body.location, timestamp: body.timestamp || timeNow,
                     free_parking: body.free_parking},
                end: { location: body.end?.location || null, timestamp: futureTime || null,
                    free_parking: body.end?.free_parking === undefined ? null : body.end?.free_parking },
                variable_cost: calculatedCost?.variable || null,
                fixed_cost: calculatedCost?.fixed || null,
                cost: calculatedCost?.total || null,
                is_active: body.is_active === undefined ? true : body.is_active
            };

            const result = await db.collectionTrips.insertOne(newTrip);
            
            return result;
        } finally {
            await db.client.close();
        }
    }
};

export default tripModel;
