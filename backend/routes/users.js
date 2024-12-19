/**
 * Route for users.
 */
import express from 'express';
import database from './../database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router
    .route("/")
    .get(async (req, res) => {
        try {
            const db = await database.getDb();
            const users = await db.collectionUsers.find().toArray();
            res.json(users);
        } catch (error) {
        console.error('Error get users:', error);
        res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    })
    .post(async (req, res) => {
        try {
            const { firstName, lastName, email, password, role } = req.body;

            if (!firstName || !lastName || !email || !role) {
                return res.status(400).json({ errorMessage: "Name, email  and role are required." });
            }

            const db = await database.getDb();
            const duplicateUser = await db.collectionUsers.findOne({ email });

            if (duplicateUser) {
                return res.status(400).json({ errorMessage: "User with this email already exists." });
            }

            const results = await db.collectionUsers.insertOne({
                firstName, lastName, email, password, role
            });

            res.status(201).json({ 
                message: 'A new user has been added',
                userInformation:
                    `New Id: ${results.insertedId},
                    First name: ${firstName},
                    Last name: ${lastName},
                    Email: ${email},
                    Password: ${password},
                    Role: ${role}`
                });

        } catch (error) {
        console.error('Error post users:', error);
        res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    });

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const db = await database.getDb();
            const userId = req.params.id;

            if (!ObjectId.isValid(userId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(userId);
            const user = await db.collectionUsers.findOne({ _id: objectId });

            if (!user) {
                return res.status(404).json({ errorMessage: "User can not be found.",
                    objectId: userId
                }
                );
            }

            res.status(200).json(user);
        } catch (error) {
            console.error('Error get one user:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    })
    .put(async (req, res) => {
        try {
            const db = await database.getDb();
            const userId = req.params.id;
            const update = req.body;

            if (!ObjectId.isValid(userId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(userId);
            const user = await db.collectionUsers.findOne({ _id: objectId });

            if (!user) {
                return res.status(404).json({ errorMessage: "User can not be found.",
                    objectId: userId
                });
            }

            const results = await db.collectionUsers.updateOne(
                { _id: objectId },
                { $set: update }
            );

            if (results.modifiedCount !== 1) {
                return res.status(400).json({
                    errorMessage: "Fail. No update possible with the given information.",
                    objectId: userId
                });
            }

            const updatedUser = await db.collectionUsers.findOne({ _id: objectId });
            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error put one user:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    })
    .delete(async (req, res) => {
        try {
            const db = await database.getDb();
            const userId = req.params.id;

            if (!ObjectId.isValid(userId)) {
                return res.status(400).json({ errorMessage: "ID format is invalid" });
            }

            const objectId = new ObjectId(userId);
            const user = await db.collectionUsers.findOne({ _id: objectId });

            if (!user) {
                return res.status(404).json({ errorMessage: "User can not be found.",
                    objectId: userId
                });
            }

            const results = await db.collectionUsers.deleteOne( { _id: objectId } );

            if (results.deletedCount !== 1) {
                return res.status(400).json({
                    errorMessage: "Fail. No delete possible with the given information.",
                    objectId: userId
                });
            }

            return res.status(200).json({
                message: "Success. User deleted.",
                objectId: userId
            });
        } catch (error) {
            console.error('Error delete one user:', error);
            res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
        }
    });

// const users = [{ name: "Eric" }, { name: "Adam" }]
// router.param("id", async (req, res, next, id) => {
//     const db = await database.getDb();
//     const user = await db.collectionUsers.findOne({ id });
//     const users = await db.collectionUsers.find().toArray();
//   req.user = users[id]
//   next()
// })

export { router };
