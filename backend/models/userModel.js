/**
 * Model object for users. Stores model functions for users route.
 */
import database from '../database-config/database.js';
import { ObjectId } from 'mongodb';
import { createError } from './utils/createError.js'

const userModel = {
    fetchAllUsers: async function fetchAllUsers() {
        const db = await database.getDb();

        try {
            const result = await db.collectionUsers.find().toArray();

            return result;
        } catch (error) {
            createError(error);
        } finally {
            await db.client.close();
        }
    },

    fetchUserById: async function fetchUserById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400)
            // return res.status(400).json({ errorMessage: "ID format is invalid" });
        }

        const db = await database.getDb();

        try {
            const filter = {
                // $and: [
                //     // {
                //     //     $or: [
                //         //         { owner: user.email },
                //         //         { collaborators: user.email }
                //         //     ]
                //         // },
                //         { _id: ObjectId.createFromHexString(id) }
                //     ]
                _id: ObjectId.createFromHexString(id)
            };
                
            const result = await db.collectionUsers.findOne(filter);

            if (!result) {
                createError(`user with ID: ${id} cannot be found`, 404);
                // return res.status(404).json({ errorMessage: "User can not be found.",
                //     objectId: userId
                // }
                // );
            }

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateUserById: async function updateUserById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400)
        }

        const db = await database.getDb();

        try {
            const filter = {
                // $and: [
                //     // {
                //     //     $or: [
                //         //         { owner: user.email },
                //         //         { collaborators: user.email }
                //         //     ]
                //         // },
                //         { _id: ObjectId.createFromHexString(id) }
                //     ]
                _id: ObjectId.createFromHexString(id)
                };
                
            let result = await db.collectionUsers.findOne(filter);

            if (!result) {
                createError(`user with ID: ${id} cannot be found`, 404);
            }

            result = await db.collectionUsers.updateOne(
                { _id: ObjectId.createFromHexString(id) },
                { $set: body }
            );

            if (result.modifiedCount !== 1) {
                createError(`Fail. No update possible with the given information for user with ID: ${id}.`, 400);
            }

            result = await db.collectionUsers.findOne(filter);

            return result;
        } finally {
            await db.client.close();
        }
    },

    createUser: async function createUser(email, hashedPassword) {
        const db = await database.getDb();

        try {
            const newUser = {
                email: email,
                password: hashedPassword,
            };

            await db.collectionUsers.insertOne(newUser);
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
        } finally {
            await db.client.close();
        }
    }
};

export default userModel;
