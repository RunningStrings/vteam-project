/**
 * Route for zones.
 */
import express from 'express';
import database from '../database-config/database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router
    .route("/")
    .get(async (req, res) => {
        try {
            const db = await database.getDb();
            const zones = await db.collectionParkingZones.find().toArray();
            res.json(zones);
        } catch (error) {
        console.error('Error get zones:', error);
        res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    })
    .post(async (req, res) => {
        try {
            const { city_id, location, bikes, capacity } = req.body;

            if (!city_id || !location) {
                return res.status(400).json({ errorMessage: `CityID and location are required.` });
            }

            const db = await database.getDb();
            const duplicateZone = await db.collectionParkingZones.findOne({ location });

            if (duplicateZone) {
                return res.status(400).json({ errorMessage: "Zone with this location already exists." });
            }

            const results = await db.collectionParkingZones.insertOne({
                city_id, location
            });

            res.status(201).json({ 
                message: 'A new zone has been added',
                zoneInformation:
                    `New Id: ${results.insertedId},
                    City ID: ${city_id},
                    Location: ${location}`
                });
        } catch (error) {
        console.error('Error post zones:', error);
        res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    });

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const db = await database.getDb();
            const zoneId = req.params.id;

            if (!ObjectId.isValid(zoneId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(zoneId);
            const zone = await db.collectionParkingZones.findOne({ _id: objectId });

            if (!zone) {
                return res.status(404).json({ errorMessage: "Zone can not be found.",
                    objectId: zoneId
                }
                );
            }
            res.status(200).json(zone);
        } catch (error) {
            console.error('Error get one zone:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    })
    .put(async (req, res) => {
        try {
            const db = await database.getDb();
            const zoneId = req.params.id;
            const update = req.body;

            if (!ObjectId.isValid(zoneId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(zoneId);
            const zone = await db.collectionParkingZones.findOne({ _id: objectId });

            if (!zone) {
                return res.status(404).json({ errorMessage: "Zone can not be found.",
                    objectId: zoneId
                });
            }

            const results = await db.collectionParkingZones.updateOne(
                { _id: objectId },
                { $set: update }
            );

            if (results.modifiedCount !== 1) {
                return res.status(400).json({
                    errorMessage: "Fail. No update possible with the given information.",
                    objectId: zoneId
                });
            }

            const updatedZone = await db.collectionParkingZones.findOne({ _id: objectId });
            return res.status(200).json(updatedZone);
        } catch (error) {
            console.error('Error put one zone:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    })
    .delete(async (req, res) => {
        try {
            const db = await database.getDb();
            const zoneId = req.params.id;

            if (!ObjectId.isValid(zoneId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(zoneId);
            const zone = await db.collectionParkingZones.findOne({ _id: objectId });

            if (!zone) {
                return res.status(404).json({ errorMessage: "Zone can not be found.",
                    objectId: zoneId
                });
            }

            const results = await db.collectionParkingZones.deleteOne( { _id: objectId } );

            if (results.deletedCount !== 1) {
                return res.status(400).json({
                    errorMessage: "Fail. No delete possible with the given information.",
                    objectId: zoneId
                });
            }

            return res.status(200).json({
                message: "Success. Zone deleted.",
                objectId: zoneId
            });
        } catch (error) {
            console.error('Error delete one zone:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    });

export { router };
