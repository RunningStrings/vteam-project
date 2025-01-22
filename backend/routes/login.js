/**
 * Route for login.
 */
import express from 'express';
import passport from 'passport';
import { tokenMiddleware } from '../middlewares/tokenMiddleware.js';
import userModel from "../models/userModel.js";
// import { createError } from '../models/utils/createError.js'

const router = express.Router();

// router
//     .route("/")
//     .get(passport.authenticate('github', {
//         scope: ['user', 'user:email'],
//         session: false
//     }));

router
    .route("/")
    .get((req, res, next) => {
        let { originUrl } = req.query;
        console.log("originUrl");
        console.log(originUrl);
        if (!originUrl) {
            originUrl = "http://localhost:1337/"
        }
        const stateParam = encodeURIComponent(originUrl);

        passport.authenticate('github', {
            scope: ['user', 'user:email'],
            session: false,
            state: stateParam  // Pass the origin as state
        })(req, res, next);  // Call the middleware with req, res, and next
    });


router
    .route("/admin")
    .patch(tokenMiddleware, async (req, res, next) => {
        try {
            // if (req.params.id !== req.token.user._id && req.token.role !== 'admin') {
            //     createError(`user with ID: ${req.params.id} cannot be found`, 404);
            // }

            const result = await userModel.updateUserById(req.token.user._id, { "role": "admin" });
            res.set('Location', `/users/${req.params.id}`);         
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error patch one user:', error);
            next(error);
        }
    });

router
    .route("/customer")
    .patch(tokenMiddleware, async (req, res, next) => {
        try {
            // if (req.params.id !== req.token.user._id && req.token.role !== 'admin') {
            //     createError(`user with ID: ${req.params.id} cannot be found`, 404);
            // }

            const result = await userModel.updateUserById(req.token.user._id, { "role": "customer" });
            res.set('Location', `/users/${req.params.id}`);         
            res.status(200).json({
                data: result
            });
        } catch (error) {
            console.error('Error patch one user:', error);
            next(error);
        }
    });

export { router };
