/**
 * Model object for cities. Stores model functions for cities route.
 */
import database from '../database.js';
import { ObjectId } from 'mongodb';
import { createError } from './utils/createError.js'

const cityModel = {
    fetchAllCities: async function fetchAllCities() {
        const db = await database.getDb();

        try {
            const result = await db.collectionCities.find().toArray();

            return result;
        } catch (error) {
            createError(error);
        } finally {
            await db.client.close();
        }
    },

    fetchCityById: async function fetchCityById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400)
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
            };
                
            const result = await db.collectionCities.findOne(filter);

            if (!result) {
                createError(`city with ID: ${id} cannot be found`, 404);
            }

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateCompleteCityById: async function updateCompleteCityById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        if (!body.name || !body.charging_stations || !body.parking_zones || !body.permitted_zones
             || !body.geometry) {
            createError(`name, charging_stations, parking_zones, permitted_zones and geometry
                 are required properties. Use patch method instead if you only
                  want to update part of the city resource.`, 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionCities.findOne(filter);    

            if (!result) {
                createError(`city with ID: ${id} cannot be found`, 404);
            }    

            const updateCity = {
                name: body.name,
                charging_stations: body.charging_stations,
                parking_zones: body.parking_zones,
                permitted_zones: body.permitted_zones,
                geometry: body.geometry
            };

            result = await db.collectionCities.updateOne(filter, { $set: updateCity });

            if (result.modifiedCount !== 1) {
                createError(`no update possible with the given information for city with ID: ${id}.
                    Make sure information you provide is new.`, 400);
            }

            result = await db.collectionCities.findOne(filter);

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateCityById: async function updateCityById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionCities.findOne(filter);

            if (!result) {
                createError(`city with ID: ${id} cannot be found`, 404);
            }

            const allowedProperties = ["name", "charging_stations",
                 "parking_zones", "permitted_zones", "geometry"];
            const reqProperties = Object.keys(body);
            const isInvalidUpdate = reqProperties.some(property =>
                 !allowedProperties.includes(property));

            if (isInvalidUpdate) {
                createError(`invalid update property key. This API only allow
                     updates of already existing properties.`, 400);
            }

            result = await db.collectionCities.updateOne(filter, { $set: body });

            if (result.modifiedCount !== 1) {
                createError(`no update possible with the given information for city with ID: ${id}.
                    Make sure information you provide is new.`, 400);
            }

            return;
        } finally {
            await db.client.close();
        }
    },

    deleteCityById: async function deleteCityById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionCities.findOne(filter);

            if (!result) {
                createError(`city with ID: ${id} cannot be found`, 404);
            }

            result = await db.collectionCities.deleteOne(filter);

            if (result.deletedCount !== 1) {
                createError(`fail, no delete possible with the given information for city with ID: ${id}.`, 400);
            }

            return;
        } finally {
            await db.client.close();
        }
    },

    createCity: async function createCity(body) {
        if (!body.name || !body.charging_stations || !body.parking_zones || !body.permitted_zones
            || !body.geometry) {
                createError(`name, charging_stations, parking_zones, permitted_zones and geometry
                    are required properties.`, 400);
        }

        const db = await database.getDb();

        try {
            const newCity = {
                name: body.name,
                charging_stations: body.charging_stations,
                parking_zones: body.parking_zones,
                permitted_zones: body.permitted_zones,
                geometry: body.geometry
            };

            const cityName = newCity.name;
            const duplicateCity = await db.collectionCities.findOne({cityName});

            if (duplicateCity) {
                createError("city with this name already exists.", 400);
            }

            const result = await db.collectionCities.insertOne(newCity);
            
            return result;
        } finally {
            await db.client.close();
        }
    }
};

export default cityModel;
