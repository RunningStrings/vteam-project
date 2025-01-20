/**
 * Route for users.
 */
import express from 'express';
import userModel from "../models/userModel.js";
import { createError } from '../models/utils/createError.js'
import { tokenMiddleware, adminTokenMiddleware } from '../middlewares/tokenMiddleware.js';

const router = express.Router();

router
    .route("/")
    .get(async (req, res, next) => {
        try {
            const result = await userModel.fetchAllUsers(req.query);
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get users:', error);
            next(error);
        }
    })
    .post(adminTokenMiddleware, async (req, res, next) => {
        try {
            const result = await userModel.createUser(req.body);
            res.set('Location', `/users/${result._id}`);
            // res.status(201).send();
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error post users:', error);
            next(error);
        }
    });

router
    .route("/:id")
    .get(tokenMiddleware, async (req, res, next) => {
        try {
            if (req.params.id !== req.token.user._id && req.token.user.role !== 'admin') {
                console.log('OH NOES I TRIGGER')
                console.log(req.token.user)
                createError(`user with ID: ${req.params.id} cannot be found`, 404);
            }

            const result = await userModel.fetchUserById(req.params.id);

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get one user:', error);
            next(error);
        }
    })
    .put(adminTokenMiddleware, async (req, res, next) => {
        try {
            const result = await userModel.updateCompleteUserById(req.params.id, req.body);            

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error put one user:', error);
            next(error);
        }
    })
    .patch(tokenMiddleware, async (req, res, next) => {
        try {
            if (req.params.id !== req.token.user._id && req.token.role !== 'admin') {
                createError(`user with ID: ${req.params.id} cannot be found`, 404);
            }

            const result = await userModel.updateUserById(req.params.id, req.body);
            res.set('Location', `/users/${req.params.id}`);         
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error patch one user:', error);
            next(error);
        }
    })
    .delete(tokenMiddleware, async (req, res, next) => {
        try {
            if (req.params.id !== req.token.user._id && req.token.role !== 'admin') {
                createError(`user with ID: ${req.params.id} cannot be found`, 404);
            }

            await userModel.deleteUserById(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Error delete one user:', error);
            next(error);
        }
    });

export { router };
