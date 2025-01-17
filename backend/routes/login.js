import express from 'express';
import passport from 'passport';
// import { generateJWT } from '../utils/jwtUtils.js';

const router = express.Router();

router
    .route("/")
    .get(passport.authenticate('github', {
        scope: ['user', 'user:email'],
        session: false
    }));

router
    .route("/admin")
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
    });

export { router };
