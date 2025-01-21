/**
 * Route for parking_zones.
 */
import express from 'express';
import zoneModel from "../models/zoneModel.js";
import { tokenMiddleware, adminTokenMiddleware } from '../middlewares/tokenMiddleware.js';

const router = express.Router();

router
    .route("/")
    .get(tokenMiddleware,async (req, res, next) => {
        try {
            const result = await zoneModel.fetchAllParkingZones(req.query);
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get parking_zones:', error);
            next(error);
        }
    })
    .post(adminTokenMiddleware, async (req, res, next) => {
        try {
            const result = await zoneModel.createParkingZone(req.body);
            res.set('Location', `/parking_zones/${result.insertedId}`);
            res.status(201).send();
        } catch (error) {
            console.error('Error post parking_zones:', error);
            next(error);
        }
    });

router
    .route("/:id")
    .get(tokenMiddleware, async (req, res, next) => {
        try {
            const result = await zoneModel.fetchParkingZoneById(req.params.id);

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get one zone:', error);
            next(error);
        }
    })
    .put(adminTokenMiddleware, async (req, res, next) => {
        try {
            const result = await zoneModel.updateCompleteParkingZoneById(req.params.id, req.body);            

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error put one zone:', error);
            next(error);
        }
    })
    .patch(adminTokenMiddleware, async (req, res, next) => {
        try {
            await zoneModel.updateParkingZoneById(req.params.id, req.body);
            res.set('Location', `/parking_zones/${req.params.id}`);         
            res.status(204).send()
        } catch (error) {
            console.error('Error patch one zone:', error);
            next(error);
        }
    })
    .delete(adminTokenMiddleware, async (req, res, next) => {
        try {
            await zoneModel.deleteParkingZoneById(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Error delete one zone:', error);
            next(error);
        }
    });

export { router };
