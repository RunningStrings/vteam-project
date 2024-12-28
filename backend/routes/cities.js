/**
 * Route for cities.
 */
import express from 'express';
import database from '../database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router
    .route("/")
    .get(async (req, res) => {
        try {
            const db = await database.getDb();
            const cities = await db.collectionCities.find().toArray();
            res.json(cities);
        } catch (error) {
        console.error('Error get cities:', error);
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
            const duplicateCity = await db.collectionCities.findOne({ location });

            if (duplicateCity) {
                return res.status(400).json({ errorMessage: "City with this location already exists." });
            }

            const results = await db.collectionCities.insertOne({
                city_id, location
            });

            res.status(201).json({ 
                message: 'A new city has been added',
                cityInformation:
                    `New Id: ${results.insertedId},
                    City ID: ${city_id},
                    Location: ${location}`
                });
        } catch (error) {
        console.error('Error post cities:', error);
        res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    });

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const db = await database.getDb();
            const cityId = req.params.id;

            if (!ObjectId.isValid(cityId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(cityId);
            const city = await db.collectionCities.findOne({ _id: objectId });

            if (!city) {
                return res.status(404).json({ errorMessage: "City can not be found.",
                    objectId: cityId
                }
                );
            }
            res.status(200).json(city);
        } catch (error) {
            console.error('Error get one city:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    })
    .patch(async (req, res) => {
        try {
            const db = await database.getDb();
            const cityId = req.params.id;
            const update = req.body;

            if (!ObjectId.isValid(cityId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(cityId);
            const city = await db.collectionCities.findOne({ _id: objectId });

            if (!city) {
                return res.status(404).json({ errorMessage: "City can not be found.",
                    objectId: cityId
                });
            }

            const results = await db.collectionCities.updateOne(
                { _id: objectId },
                { $set: update }
            );

            if (results.modifiedCount !== 1) {
                return res.status(400).json({
                    errorMessage: "Fail. No update possible with the given information.",
                    objectId: cityId
                });
            }

            const updatedCity = await db.collectionCities.findOne({ _id: objectId });
            return res.status(200).json(updatedCity);
        } catch (error) {
            console.error('Error patch one city:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    })
    .delete(async (req, res) => {
        try {
            const db = await database.getDb();
            const cityId = req.params.id;

            if (!ObjectId.isValid(cityId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(cityId);
            const city = await db.collectionCities.findOne({ _id: objectId });

            if (!city) {
                return res.status(404).json({ errorMessage: "City can not be found.",
                    objectId: cityId
                });
            }

            const results = await db.collectionCities.deleteOne( { _id: objectId } );

            if (results.deletedCount !== 1) {
                return res.status(400).json({
                    errorMessage: "Fail. No delete possible with the given information.",
                    objectId: cityId
                });
            }

            return res.status(200).json({
                message: "Success. City deleted.",
                objectId: cityId
            });
        } catch (error) {
            console.error('Error delete one city:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    });

export { router };
