/**
 * Route for bikes.
 */
import express from 'express';
import bikeModel from "../models/bikeModel.js";
import { tokenMiddleware, adminTokenMiddleware } from '../middlewares/tokenMiddleware.js';

const router = express.Router();

router
    .route("/")
    .get(async (req, res, next) => {
        const { limit, offset, city_name } = req.query;
        try {
            const parsedLimit = limit ? parseInt(limit, 10) : undefined;
            const parsedOffset = offset ? parseInt(offset, 10) : undefined;

            const result = await bikeModel.fetchAllBikes(parsedLimit, parsedOffset, city_name);
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get bikes:', error);
            next(error);
        }
    })
    .post(adminTokenMiddleware, async (req, res, next) => {
        try {
            const result = await bikeModel.createBike(req.body);
            res.set('Location', `/bikes/${result.insertedId}`);
            res.status(201).send();
        } catch (error) {
            console.error('Error post bikes:', error);
            next(error);
        }
    });

router
    .route("/:id")
    .get(tokenMiddleware, async (req, res, next) => {
        try {
            const result = await bikeModel.fetchBikeById(req.params.id);

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get one bike:', error);
            next(error);
        }
    })
    .put(adminTokenMiddleware, async (req, res, next) => {
        try {
            const result = await bikeModel.updateCompleteBikeById(req.params.id, req.body);            

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error put one bike:', error);
            next(error);
        }
    })
    .patch(adminTokenMiddleware, async (req, res, next) => {
        try {
            await bikeModel.updateBikeById(req.params.id, req.body);
            res.set('Location', `/bikes/${req.params.id}`);         
            res.status(204).send()
        } catch (error) {
            console.error('Error patch one bike:', error);
            next(error);
        }
    })
    .delete(adminTokenMiddleware, async (req, res, next) => {
        try {
            await bikeModel.deleteBikeById(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Error delete one bike:', error);
            next(error);
        }
    });

export { router };
