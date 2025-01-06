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

    updateCompleteUserById: async function updateCompleteUserById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        if (!body.firstname || !body.lastname || !body.email || !body.role || !body.balance) {
            createError("firstname, lastname, email, balance and role are required."
                + " Use patch method instead if you only want to update part of the user resource."
                , 400);
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

            const updateUser = {
                firstname: body.firstname,
                lastname: body.lastname,
                email: body.email,
                password_hash: body.password,
                role: body.role,
                balance: body.balance,
            };

            if (body.trip_history) {
                updateUser.trip_history = body.trip_history;
            }

            result = await db.collectionUsers.updateOne(filter, { $set: updateUser });

            if (result.modifiedCount !== 1) {
                createError(`no update possible with the given information for user with ID: ${id}.`
                    + " Make sure information you provide is new.", 400);
            }

            result = await db.collectionUsers.findOne(filter);

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateUserById: async function updateUserById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
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


            const allowedProperties = ["firstname", "lastname",
                "email", "password", "role", "balance"];
            const reqProperties = Object.keys(body);
            const isInvalidUpdate = reqProperties.some(property =>
                !allowedProperties.includes(property));

           if (isInvalidUpdate) {
               createError("invalid update property key. This API only allow"
                    + " updates of already existing properties.", 400);
           }

            result = await db.collectionUsers.updateOne(filter, { $set: body });

            if (result.modifiedCount !== 1) {
                createError(`no update possible with the given information for user with ID: ${id}.`
                    + " Make sure information you provide is new.", 400);
            }

            return;

            // result = await db.collectionUsers.findOne(filter);

            // return result;
        } finally {
            await db.client.close();
        }
    },

    deleteUserById: async function deleteUserById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
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

            result = await db.collectionUsers.deleteOne(filter);

            if (result.deletedCount !== 1) {
                createError(`fail. No delete possible with the given information for user with ID: ${id}.`, 400);
            }

            return;
        } finally {
            await db.client.close();
        }
    },

    createUser: async function createUser(body) {
        if (!body.firstname || !body.lastname || !body.email || !body.role) {
            createError("firstname, lastname, email and role are required.", 400);
        }

        const db = await database.getDb();

        try {
            const newUser = {
                firstname: body.firstname,
                lastname: body.lastname,
                email: body.email,
                password_hash: body.password,
                role: body.role,
                balance: body.balance,
                trip_history: []
            };

            const email = newUser.email;
            const duplicateUser = await db.collectionUsers.findOne({email});

            if (duplicateUser) {
                createError("User with this email already exists.", 400)
            }

            const result = await db.collectionUsers.insertOne(newUser);
            
            return result;
        } finally {
            await db.client.close();
        }
    }

    // createUser: async function createUser(email, hashedPassword) {
    //     const db = await database.getDb();

    //     try {
    //         const newUser = {
    //             email: email,
    //             password_hash: hashedPassword,
    //         };

    //         await db.collectionUsers.insertOne(newUser);
    //     } catch (error) {
    //         throw new Error(error.message ? error.message : "Database error");
    //     } finally {
    //         await db.client.close();
    //     }
    // }
};

export default userModel;
