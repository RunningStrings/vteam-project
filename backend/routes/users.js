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
        console.error('Error users:', error);
        res.status(500).json({ errorMessage: "Server Error" });
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

            const input = await db.collectionUsers.insertOne({
                firstName, lastName, email, password, role
            });

            res.status(201).json({ 
                message: 'A new user has been added',
                userInformation:
                    `New Id: ${input.insertedId},
                    First name: ${firstName},
                    Last name: ${lastName},
                    Email: ${email},
                    Password: ${password},
                    Role: ${role}`
                });

        } catch (error) {
        console.error('Error users:', error);
        res.status(500).json({ errorMessage: "Server Error" });
        }
    });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
        const db = await database.getDb();
        const userId = req.params.id;
        const objectId = new ObjectId(userId);
        const user = await db.collectionUsers.findOne({ objectId });

        if (!user) {
            return res.status(404).json({ errorMessage: "User can not be found.",
                objectId: objectId
             }
            );
        }

        res.status(200).json(user);
    } catch (error) {
    console.error('Error users:', error);
    res.status(500).json({ errorMessage: "Server Error" });
    }
  })
  .put(async (req, res) => {
    res.send(`Update User With ID ${req.params.id}`);
  })
  .delete(async (req, res) => {
    const input = await db.collection('users').deleteOne({ email });
    res.send(`Delete User With ID ${req.params.id}`);
    try {
        const db = await database.getDb();
        const users = await db.collectionUsers.find().toArray();
        res.json(users);
        } catch (error) {
        console.error('Error users:', error);
        res.status(500).json({ errorMessage: "Server Error" });
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
