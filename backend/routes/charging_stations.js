/**
 * Route for charging stations.
 */
import express from 'express';
import database from'../database_config/database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router
    .route("/")
    .get(async (req, res) => {
        try {
            const db = await database.getDb();
            const stations = await db.collectionChargingStations.find().toArray();
            res.json(stations);
        } catch (error) {
        console.error('Error get stations:', error);
        res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    })
    .post(async (req, res) => {
        try {
            const { city_id, location, bikes, capacity } = req.body;

            if (!city_id || !location || !bikes || !capacity) {
                return res.status(400).json({ errorMessage: `CityID, location, bikes and capacity
                     are required.` });
            }

            const db = await database.getDb();
            const duplicateStation = await db.collectionChargingStations.findOne({ location });

            if (duplicateStation) {
                return res.status(400).json({ errorMessage: "Station with this location already exists." });
            }

            const results = await db.collectionChargingStations.insertOne({
                city_id, location, bikes, capacity
            });

            res.status(201).json({ 
                message: 'A new station has been added',
                stationInformation:
                    `New Id: ${results.insertedId},
                    City ID: ${city_id},
                    Location: ${location},
                    Bikes: ${bikes},
                    Capacity: ${capacity}`
                });
        } catch (error) {
        console.error('Error post stations:', error);
        res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    });

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const db = await database.getDb();
            const stationId = req.params.id;

            if (!ObjectId.isValid(stationId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(stationId);
            const station = await db.collectionChargingStations.findOne({ _id: objectId });

            if (!station) {
                return res.status(404).json({ errorMessage: "Station can not be found.",
                    objectId: stationId
                }
                );
            }
            res.status(200).json(station);
        } catch (error) {
            console.error('Error get one station:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    })
    .put(async (req, res) => {
        try {
            const db = await database.getDb();
            const stationId = req.params.id;
            const update = req.body;

            if (!ObjectId.isValid(stationId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(stationId);
            const station = await db.collectionChargingStations.findOne({ _id: objectId });

            if (!station) {
                return res.status(404).json({ errorMessage: "Station can not be found.",
                    objectId: stationId
                });
            }

            const results = await db.collectionChargingStations.updateOne(
                { _id: objectId },
                { $set: update }
            );

            if (results.modifiedCount !== 1) {
                return res.status(400).json({
                    errorMessage: "Fail. No update possible with the given information.",
                    objectId: stationId
                });
            }

            const updatedStation = await db.collectionChargingStations.findOne({ _id: objectId });
            return res.status(200).json(updatedStation);
        } catch (error) {
            console.error('Error put one station:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    })
    .delete(async (req, res) => {
        try {
            const db = await database.getDb();
            const stationId = req.params.id;

            if (!ObjectId.isValid(stationId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(stationId);
            const station = await db.collectionChargingStations.findOne({ _id: objectId });

            if (!station) {
                return res.status(404).json({ errorMessage: "Station can not be found.",
                    objectId: stationId
                });
            }

            const results = await db.collectionChargingStations.deleteOne( { _id: objectId } );

            if (results.deletedCount !== 1) {
                return res.status(400).json({
                    errorMessage: "Fail. No delete possible with the given information.",
                    objectId: stationId
                });
            }

            return res.status(200).json({
                message: "Success. Station deleted.",
                objectId: stationId
            });
        } catch (error) {
            console.error('Error delete one station:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    });

export { router };
