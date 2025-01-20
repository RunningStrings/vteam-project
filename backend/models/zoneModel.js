/**
 * Model object for parking_zones. Stores model functions for parking_zones route.
 */
import database from '../database-config/database.js';
import { ObjectId } from 'mongodb';
import { createError } from './utils/createError.js'

const zoneModel = {
    fetchAllParkingZones: async function fetchAllParkingZones() {
        const db = await database.getDb();

        try {
            const result = await db.collectionParkings.find().toArray();

            return result;
        } finally {
            await db.client.close();
        }
    },

    fetchParkingZoneById: async function fetchParkingZoneById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400)
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
            };
                
            const result = await db.collectionParkings.findOne(filter);

            if (!result) {
                createError(`zone with ID: ${id} cannot be found`, 404);
            }

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateCompleteParkingZoneById: async function updateCompleteParkingZoneById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        if (!body.city_name || !body.location || !body.name) {
            createError("city_name, name and location"
                + "are required properties. Use patch method instead if you only"
                +  " want to update part of the zone resource.", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionParkings.findOne(filter);    

            if (!result) {
                createError(`zone with ID: ${id} cannot be found`, 404);
            }    

            const updateParkingZone = {
                id: body.id || null,
                name: body.name,
                city_name: body.city_name,
                location: body.location,
                bikes: body.bikes || [],
                capacity: body.capacity || null
            };

            result = await db.collectionParkings.updateOne(filter, { $set: updateParkingZone });

            // if (result.modifiedCount !== 1) {
            //     createError(`no update possible with the given information for zone with ID: ${id}.`
            //     + " Make sure information you provide is new.", 400);
            // }

            result = await db.collectionParkings.findOne(filter);

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateParkingZoneById: async function updateParkingZoneById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionParkings.findOne(filter);

            if (!result) {
                createError(`zone with ID: ${id} cannot be found`, 404);
            }

            const allowedProperties = ["city_name", "location", "id", "name", "location", "capacity"];
            const reqProperties = Object.keys(body);
            const isInvalidUpdate = reqProperties.some(property =>
                 !allowedProperties.includes(property));

            if (isInvalidUpdate) {
                createError("invalid update property key. This API only allow"
                + " updates of already existing properties.", 400);
            }

            result = await db.collectionParkings.updateOne(filter, { $set: body });

            // if (result.modifiedCount !== 1) {
            //     createError(`no update possible with the given information for zone with ID: ${id}.`
            //     + " Make sure information you provide is new.", 400);
            // }

            return;
        } finally {
            await db.client.close();
        }
    },

    deleteParkingZoneById: async function deleteParkingZoneById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        const db = await database.getDb();

        try {
            const filter = {
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionParkings.findOne(filter);

            if (!result) {
                createError(`zone with ID: ${id} cannot be found`, 404);
            }

            result = await db.collectionParkings.deleteOne(filter);

            if (result.deletedCount !== 1) {
                createError(`fail, no delete possible with the given information for zone with ID: ${id}.`, 400);
            }

            return;
        } finally {
            await db.client.close();
        }
    },

    createParkingZone: async function createParkingZone(body) {
        if (!body.city_name || !body.location || !body.name) {
                createError(`city_name, name and location are required properties.`, 400);
        }

        const db = await database.getDb();

        try {
            const newParkingZone = {
                id: body.id || null,
                name: body.name,
                city_name: body.city_name,
                location: body.location,
                bikes: body.bikes || [],
                capacity: body.capacity || null

            };

            const zoneName = newParkingZone.name;
            const duplicateParkingZone = await db.collectionParkings.findOne({zoneName});

            if (duplicateParkingZone) {
                createError("zone with this name already exists.", 400);
            }

            const result = await db.collectionParkings.insertOne(newParkingZone);
            
            return result;
        } finally {
            await db.client.close();
        }
    }
};

export default zoneModel;
