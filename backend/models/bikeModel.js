/**
 * Model object for bikes. Stores model functions for bikes route.
 */
import database from '../database-config/database.js';
import { ObjectId } from 'mongodb';
import { createError } from './utils/createError.js'

const bikeModel = {
    fetchAllBikes: async function fetchAllBikes() {
        const db = await database.getDb();

        try {
            const result = await db.collectionBikes.find().toArray();

            return result;
        } finally {
            await db.client.close();
        }
    },

    fetchBikeById: async function fetchBikeById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400)
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
            };
                
            const result = await db.collectionBikes.findOne(filter);

            if (!result) {
                createError(`bike with ID: ${id} cannot be found`, 404);
            }

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateCompleteBikeById: async function updateCompleteBikeById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        if (!body.city_id || !body.location || !body.status || !body.battery_level || !body.speed) {
            createError(`city_id, location, status, speed and battery_level are required. Use patch method
                 instead if you only want to update part of the bike resource.`, 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionBikes.findOne(filter);    

            if (!result) {
                createError(`bike with ID: ${id} cannot be found`, 404);
            }    

            const updateBike = {
                city_id: body.city_id,
                location: body.location,
                status: body.status,
                battery_level: body.battery_level,
                speed: body.speed
            };

            result = await db.collectionBikes.updateOne(filter, { $set: updateBike });

            if (result.modifiedCount !== 1) {
                createError(`no update possible with the given information for bike with ID: ${id}.
                    Make sure information you provide is new.`, 400);
            }

            result = await db.collectionBikes.findOne(filter);

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateBikeById: async function updateBikeById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionBikes.findOne(filter);

            if (!result) {
                createError(`bike with ID: ${id} cannot be found`, 404);
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

            result = await db.collectionBikes.updateOne(filter, { $set: body });

            if (result.modifiedCount !== 1) {
                createError(`no update possible with the given information for bike with ID: ${id}.
                    Make sure information you provide is new.`, 400);
            }

            return;
        } finally {
            await db.client.close();
        }
    },

    deleteBikeById: async function deleteBikeById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionBikes.findOne(filter);

            if (!result) {
                createError(`bike with ID: ${id} cannot be found`, 404);
            }

            result = await db.collectionBikes.deleteOne(filter);

            if (result.deletedCount !== 1) {
                createError(`fail, no delete possible with the given information for bike with ID: ${id}.`, 400);
            }

            return;
        } finally {
            await db.client.close();
        }
    },

    createBike: async function createBike(body) {
        if (!body.city_id || !body.location || !body.status || !body.battery_level || !body.speed) {
            createError("city_id, location, status, speed and battery_level are required.", 400);
        }

        const db = await database.getDb();

        try {
            const newBike = {
                city_id: body.city_id,
                location: body.location,
                status: body.status,
                battery_level: body.battery_level,
                speed: body.speed
            };

            // const status = newBike.status;
            // const duplicateBike = await db.collectionBikes.findOne({status});

            // if (duplicateBike) {
            //     createError("Bike with this status already exists.", 400)
            // }

            const result = await db.collectionBikes.insertOne(newBike);
            
            return result;
        } finally {
            await db.client.close();
        }
    }
};

export default bikeModel;
