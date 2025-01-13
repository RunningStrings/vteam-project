import database from '../db/database.mjs';
import bcrypt from 'bcryptjs';

import userModel from './userModel.mjs';
import tokenService from '../services/tokenService.mjs';

const saltRounds = 10;

const authModel = {
    register: async function register(email, password) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }

        const db = await database.getDb();

        try {
            const user = await userModel.fetchUserByEmail(email);

            if (user) {
                throw new Error("User already registered");
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            await userModel.createUser(email, hashedPassword);

            const token = tokenService.generateToken({ email: email});

            return { success: true, token: token };
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    },

    login: async function login(email, password) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }

        const db = await database.getDb();

        try {
            const user = await userModel.fetchUserByEmail(email);

            if (!user) {
                throw new Error( "User not found");
            }
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                throw new Error("Incorrect password");
            }
            const token = tokenService.generateToken({ email: email});

            return { success: true, token: token };
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    }
};

export default authModel;