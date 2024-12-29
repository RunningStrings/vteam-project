/**
 * Route for users.
 */
import express from 'express';
import userModel from "../models/userModel.js";

const router = express.Router();

router
    .route("/")
    .get(async (req, res, next) => {
        try {
            const result = await userModel.fetchAllUsers();
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get users:', error);
            next(error)
        }
    })
    .post(async (req, res, next) => {
        try {
            const result = await userModel.createUser(req.body);
            res.set('Location', `/users/${result.insertedId}`);
            res.status(201).send();
        } catch (error) {
            console.error('Error post users:', error);
            next(error);
        }
    });

router
    .route("/:id")
    .get(async (req, res, next) => {
        try {
            const result = await userModel.fetchUserById(req.params.id);

            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error get one user:', error);
            next(error)
        }
    })
    .put(async (req, res, next) => {
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
    .patch(async (req, res, next) => {
        try {
            await userModel.updateUserById(req.params.id, req.body);
            res.set('Location', `/users/${req.params.id}`);         
            res.status(204).send()
        } catch (error) {
            console.error('Error patch one user:', error);
            next(error);
        }
    })
    .delete(async (req, res, next) => {
        try {
            await userModel.deleteUserById(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Error delete one user:', error);
            next(error);
        }
    });

export { router };
