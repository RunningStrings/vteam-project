/**
 * Route for cities.
 */
import express from 'express';
import cityModel from "../models/cityModel.js";
import { tokenMiddleware, adminTokenMiddleware } from '../middlewares/tokenMiddleware.js';

const router = express.Router();

router
    .route("/")
    .get(async (req, res, next) => {
        try {
            const result = await cityModel.fetchAllCities();
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get cities:', error);
            next(error);
        }
    })
    .post(adminTokenMiddleware, async (req, res, next) => {
        try {
            const result = await cityModel.createCity(req.body);
            res.set('Location', `/cities/${result.insertedId}`);
            res.status(201).send();
        } catch (error) {
            console.error('Error post cities:', error);
            next(error);
        }
    });

router
    .route("/:id")
    .get(async (req, res, next) => {
        try {
            const result = await cityModel.fetchCityById(req.params.id);

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get one city:', error);
            next(error);
        }
    })
    .put(adminTokenMiddleware, async (req, res, next) => {
        try {
            const result = await cityModel.updateCompleteCityById(req.params.id, req.body);            

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error put one city:', error);
            next(error);
        }
    })
    .patch(adminTokenMiddleware, async (req, res, next) => {
        try {
            await cityModel.updateCityById(req.params.id, req.body);
            res.set('Location', `/cities/${req.params.id}`);         
            res.status(204).send()
        } catch (error) {
            console.error('Error patch one city:', error);
            next(error);
        }
    })
    .delete(adminTokenMiddleware,async (req, res, next) => {
        try {
            await cityModel.deleteCityById(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Error delete one city:', error);
            next(error);
        }
    });

export { router };
