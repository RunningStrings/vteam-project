/**
 * Route for charging_stations.
 */
import express from 'express';
import stationModel from "../models/stationModel.js";
import { tokenMiddleware, adminTokenMiddleware } from '../middlewares/tokenMiddleware.js';

const router = express.Router();

router
    .route("/")
    .get(tokenMiddleware, async (req, res, next) => {
        try {
            const result = await stationModel.fetchAllChargingStations();
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get charging_stations:', error);
            next(error);
        }
    })
    .post(adminTokenMiddleware, async (req, res, next) => {
        try {
            const result = await stationModel.createChargingStation(req.body);
            res.set('Location', `/charging_stations/${result.insertedId}`);
            res.status(201).send();
        } catch (error) {
            console.error('Error post charging_stations:', error);
            next(error);
        }
    });

router
    .route("/:id")
    .get(tokenMiddleware, async (req, res, next) => {
        try {
            const result = await stationModel.fetchChargingStationById(req.params.id);

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get one station:', error);
            next(error);
        }
    })
    .put(adminTokenMiddleware, async (req, res, next) => {
        try {
            const result = await stationModel.updateCompleteChargingStationById(req.params.id, req.body);            

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error put one station:', error);
            next(error);
        }
    })
    .patch(adminTokenMiddleware, async (req, res, next) => {
        try {
            await stationModel.updateChargingStationById(req.params.id, req.body);
            res.set('Location', `/charging_stations/${req.params.id}`);         
            res.status(204).send()
        } catch (error) {
            console.error('Error patch one station:', error);
            next(error);
        }
    })
    .delete(adminTokenMiddleware, async (req, res, next) => {
        try {
            await stationModel.deleteChargingStationById(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Error delete one station:', error);
            next(error);
        }
    });

export { router };
