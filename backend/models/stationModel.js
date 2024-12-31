/**
 * Model object for charging_stations. Stores model functions for charging_stations route.
 */
import database from '../database.js';
import { ObjectId } from 'mongodb';
import { createError } from './utils/createError.js'

const stationModel = {
    fetchAllChargingStations: async function fetchAllChargingStations() {
        const db = await database.getDb();

        try {
            const result = await db.collectionChargingStations.find().toArray();

            return result;
        } catch (error) {
            createError(error);
        } finally {
            await db.client.close();
        }
    },

    fetchChargingStationById: async function fetchChargingStationById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400)
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
            };
                
            const result = await db.collectionChargingStations.findOne(filter);

            if (!result) {
                createError(`station with ID: ${id} cannot be found`, 404);
            }

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateCompleteChargingStationById: async function updateCompleteChargingStationById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        if (!body.city_id || !body.location || !body.bikes || !body.capacity) {
            createError(`city_id, location, bikes and capacity are required properties.
                 Use patch method instead if you only
                  want to update part of the station resource.`, 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionChargingStations.findOne(filter);    

            if (!result) {
                createError(`station with ID: ${id} cannot be found`, 404);
            }    

            const updateChargingStation = {
                city_id: body.city_id,
                location: body.location,
                bikes: body.bikes,
                capacity: body.capacity
            };

            result = await db.collectionChargingStations.updateOne(filter, { $set: updateChargingStation });

            if (result.modifiedCount !== 1) {
                createError(`no update possible with the given information for station with ID: ${id}.
                    Make sure information you provide is new.`, 400);
            }

            result = await db.collectionChargingStations.findOne(filter);

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateChargingStationById: async function updateChargingStationById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionChargingStations.findOne(filter);

            if (!result) {
                createError(`station with ID: ${id} cannot be found`, 404);
            }

            const allowedProperties = ["city_id", "location",
                 "bikes", "capacity"];
            const reqProperties = Object.keys(body);
            const isInvalidUpdate = reqProperties.some(property =>
                 !allowedProperties.includes(property));

            if (isInvalidUpdate) {
                createError(`invalid update property key. This API only allow
                     updates of already existing properties.`, 400);
            }

            result = await db.collectionChargingStations.updateOne(filter, { $set: body });

            if (result.modifiedCount !== 1) {
                createError(`no update possible with the given information for station with ID: ${id}.
                    Make sure information you provide is new.`, 400);
            }

            return;
        } finally {
            await db.client.close();
        }
    },

    deleteChargingStationById: async function deleteChargingStationById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionChargingStations.findOne(filter);

            if (!result) {
                createError(`station with ID: ${id} cannot be found`, 404);
            }

            result = await db.collectionChargingStations.deleteOne(filter);

            if (result.deletedCount !== 1) {
                createError(`fail, no delete possible with the given information for station with ID: ${id}.`, 400);
            }

            return;
        } finally {
            await db.client.close();
        }
    },

    createChargingStation: async function createChargingStation(body) {
        if (!body.city_id || !body.location || !body.bikes || !body.capacity) {
                createError(`city_id, location, bikes and capacity
                    are required properties.`, 400);
        }

        const db = await database.getDb();

        try {
            const newChargingStation = {
                city_id: body.city_id,
                location: body.location,
                bikes: body.bikes,
                capacity: body.capacity
            };

            // const stationName = newChargingStation.city_id;
            // const duplicateChargingStation = await db.collectionChargingStations.findOne({stationName});

            // if (duplicateChargingStation) {
            //     createError("station with this city_id already exists.", 400);
            // }

            const result = await db.collectionChargingStations.insertOne(newChargingStation);
            
            return result;
        } finally {
            await db.client.close();
        }
    }
};

export default stationModel;
