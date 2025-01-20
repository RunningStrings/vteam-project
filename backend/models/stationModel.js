/**
 * Model object for charging_stations. Stores model functions for charging_stations route.
 */
import database from '../database-config/database.js';
import { ObjectId } from 'mongodb';
import { createError } from './utils/createError.js'

const stationModel = {
    fetchAllChargingStations: async function fetchAllChargingStations() {
        const db = await database.getDb();

        try {
            const result = await db.collectionStations.find().toArray();

            return result;
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
                
            const result = await db.collectionStations.findOne(filter);

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

        if (!body.city_name || !body.location || !body.name) {
            createError("city_name, location and name are required properties."
                + " Use patch method instead if you only"
                + " want to update part of the station resource.", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionStations.findOne(filter);    

            if (!result) {
                createError(`station with ID: ${id} cannot be found`, 404);
            }    

            const updateChargingStation = {
                id: body.id || null,
                name: body.name,
                city_name: body.city_name,
                location: body.location,
                bikes: body.bikes || [],
                capacity: body.capacity || null
            };

            result = await db.collectionStations.updateOne(filter, { $set: updateChargingStation });

            // if (result.modifiedCount !== 1) {
            //     createError(`no update possible with the given information for station with ID: ${id}.
            //         Make sure information you provide is new.`, 400);
            // }

            result = await db.collectionStations.findOne(filter);

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
                
            let result = await db.collectionStations.findOne(filter);

            if (!result) {
                createError(`station with ID: ${id} cannot be found`, 404);
            }

            const allowedProperties = ["city_name", "location",
                 "bikes", "capacity", "name", "id"];
            const reqProperties = Object.keys(body);
            const isInvalidUpdate = reqProperties.some(property =>
                 !allowedProperties.includes(property));

            if (isInvalidUpdate) {
                createError("invalid update property key. This API only allow"
                    + " updates of already existing properties.", 400);
            }

            result = await db.collectionStations.updateOne(filter, { $set: body });

            // if (result.modifiedCount !== 1) {
            //     createError(`no update possible with the given information for station with ID: ${id}.
            //         Make sure information you provide is new.`, 400);
            // }

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
                
            let result = await db.collectionStations.findOne(filter);

            if (!result) {
                createError(`station with ID: ${id} cannot be found`, 404);
            }

            result = await db.collectionStations.deleteOne(filter);

            if (result.deletedCount !== 1) {
                createError(`fail, no delete possible with the given information for station with ID: ${id}.`, 400);
            }

            return;
        } finally {
            await db.client.close();
        }
    },

    createChargingStation: async function createChargingStation(body) {
        if (!body.city_name || !body.location || !body.name) {
                createError("city_name, name and location are required properties.", 400);
        }

        const db = await database.getDb();

        try {
            const newChargingStation = {
                id: body.id || null,
                name: body.name,
                city_name: body.city_name,
                location: body.location,
                bikes: body.bikes || [],
                capacity: body.capacity || null
            };

            const stationName = newChargingStation.name;
            const duplicateChargingStation = await db.collectionStations.findOne({stationName});

            if (duplicateChargingStation) {
                createError("station with this city_name already exists.", 400);
            }

            const result = await db.collectionStations.insertOne(newChargingStation);
            
            return result;
        } finally {
            await db.client.close();
        }
    },

    moveBikeToChargingStation: async function moveBikeToChargingStation(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        const db = await database.getDb();
        // const session = db.client.startSession();
        // session.startTransaction();
        try {
            const filterStation = {
                _id: ObjectId.createFromHexString(id)
            };

            let resultStation = await db.collectionStations.findOne(filterStation);

            if (!resultStation) {
                createError(`station with ID: ${id} cannot be found`, 404);
            }

            // const allowedProperties = ["bikeId"];
            // const reqProperties = Object.keys(bikeId);
            // const isInvalidUpdate = reqProperties.some(property =>
            //     !allowedProperties.includes(property));

            if (!Object.keys(body).includes('bikeId')) {
                createError("bikeId is required", 400);
            }

            const updateStation = {
                $addToSet: { bikes: body.bikeId }
              };

            await db.collectionStations.updateOne(filterStation, updateStation);

            const filterBike = {
                id: body.bikeId
            };

            const resultBike = await db.collectionBikes.findOne(filterBike);

            if (!resultBike) {
                createError(`bike with ID: ${id} cannot be found`, 404);
            }

            const updateBike = {
                location: resultStation.location
            };

            await db.collectionBikes.updateOne(filterBike, { $set: updateBike });
            // await session.commitTransaction();
            resultStation = await db.collectionStations.findOne(filterStation);
            return resultStation;

        } finally {
            await db.client.close();
        }
    }
};

export default stationModel;
