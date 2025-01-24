// import * as dotenv from 'dotenv';
// dotenv.config();

// import jwt from 'jsonwebtoken';
import { createError } from '../models/utils/createError.js'
import tokenService from '../services/tokenService.js'

// const secret = process.env.JWT_SECRET;

const tokenMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        createError("unauthorized. No token found.", 401)
    }

    try {
        const userToken = tokenService.verifyToken(token);
        req.token = userToken;
        next();
    } catch {
        createError("unauthorized. Invalid token.", 401);
    };
};

const adminTokenMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        createError("unauthorized. No token found.", 401)
    }

    try {
        const adminToken = tokenService.verifyToken(token);
        req.token = adminToken;
    } catch {
        createError("unauthorized. Invalid token.", 401);
    };

    if (req.token.user.role !== 'admin') {
        createError("you need admin privileges for this route", 403);
    }
    next();
};

export { tokenMiddleware, adminTokenMiddleware };
