/**
 * Route for trips.
 */
import express from 'express';
import tripModel from "../models/tripModel.js";

const router = express.Router();

router
    .route("/")
    .get(async (req, res, next) => {
        try {
            const result = await tripModel.fetchAllTrips();
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get trips:', error);
            next(error);
        }
    })
    .post(async (req, res, next) => {
        try {
            const result = await tripModel.createTrip(req.body);
            res.set('Location', `/trips/${result.insertedId}`);
            res.status(201).send();
        } catch (error) {
            console.error('Error post trips:', error);
            next(error);
        }
    });

router
    .route("/:id")
    .get(async (req, res, next) => {
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
    .put(async (req, res, next) => {
        try {
            const result = await tripModel.updateCompleteTripById(req.params.id, req.body);            

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error put one trip:', error);
            next(error);
        }
    })
    .patch(async (req, res, next) => {
        try {
            await tripModel.updateTripById(req.params.id, req.body);
            res.set('Location', `/trips/${req.params.id}`);         
            res.status(204).send()
        } catch (error) {
            console.error('Error patch one trip:', error);
            next(error);
        }
    })
    .delete(async (req, res, next) => {
        try {
            await tripModel.deleteTripById(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Error delete one trip:', error);
            next(error);
        }
    });

export { router };
