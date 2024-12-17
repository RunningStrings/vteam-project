/**
 * Route for charging stations.
 */

import express from 'express';
import database from './../database.js';
const router = express.Router();

router
    .route("/")
    .get(async (req, res) => {
        try {
            const db = await database.getDb();
            const chargingStations = await db.collectionChargingStations.find().toArray();
            res.json(chargingStations);
        } catch (error) {
            console.error('Error fetching charging stations:', error);
            res.status(500).json({ errorMessage: "Server Error" });
        }
    })
    .put((req, res) => {
        res.send(`Update User With ID ${req.params.id}`);
    })
    .delete((req, res) => {
        res.send(`Delete User With ID ${req.params.id}`);
    });

export { router };
