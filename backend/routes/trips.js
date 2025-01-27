/**
 * Route for trips.
 */
import express from 'express';
import tripModel from "../models/tripModel.js";
import { tokenMiddleware, adminTokenMiddleware } from '../middlewares/tokenMiddleware.js';

const router = express.Router();

router
    .route("/")
    .get(tokenMiddleware,async (req, res, next) => {
        try {
            const result = await tripModel.fetchAllTrips(req.query);
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get trips:', error);
            next(error);
        }
    })
    .post(tokenMiddleware, async (req, res, next) => {
        try {
            const result = await tripModel.createTrip(req.body);
            res.set('Location', `/trips/${result.insertedId}`);
            res.status(201).send({ tripId: result.insertedId });
        } catch (error) {
            console.error('Error post trips:', error);
            next(error);
        }
    });

router
    .route("/:id")
    .get(tokenMiddleware, async (req, res, next) => {
        try {
            const result = await tripModel.fetchTripById(req.params.id);

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get one trip:', error);
            next(error);
        }
    })
    .patch(tokenMiddleware, async (req, res, next) => {
        try {
            await tripModel.updateTripById(req.params.id, req.body);
            res.set('Location', `/trips/${req.params.id}`);         
            res.status(204).send()
        } catch (error) {
            console.error('Error patch one trip:', error);
            next(error);
        }
    })
    .delete(adminTokenMiddleware, async (req, res, next) => {
        try {
            await tripModel.deleteTripById(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Error delete one trip:', error);
            next(error);
        }
    });

export { router };
