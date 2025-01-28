/**
 * Model object for users. Stores model functions for users route.
 */
import database from "../database-config/database.js";
import { ObjectId } from "mongodb";
import { createError } from "./utils/createError.js";
import { updateUser } from "./utils/updateUser.js";
import { buildLinks } from "./utils/buildLinks.js";

const userModel = {
    fetchAllUsers: async function fetchAllUsers(req) {
        const db = await database.getDb();

        try {
            const { role, sortField, sortDirection = "asc", limit = 0, page = 1 } = req.query;

            const parsedLimit = parseInt(limit, 10);
            const parsedPage = parseInt(page, 10);
            const offset = (parsedPage - 1) * parsedLimit;
            const filter = role ? { role: { $regex: new RegExp(role, "i") } } : {};
            const sortObject = sortField ? { [sortField]: sortDirection === "desc" ? -1 : 1 } : {};

            const totalCount = await db.collectionUsers.countDocuments(filter);
            const totalPages = parsedLimit === 0 ? 1 : Math.ceil(totalCount / parsedLimit);

            const result = await db.collectionUsers
                .find(filter)
                .sort(sortObject)
                .skip(offset)
                .limit(parsedLimit)
                .toArray();
            
            const links = buildLinks(req, parsedPage, totalPages, parsedLimit);

            // const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

            // const links = [
            //     ...(parsedPage > 1 ? [`<${baseUrl}?page=${parsedPage - 1}&limit=${parsedLimit}>; rel="previous"`] : []),
            //     ...(parsedPage < totalPages ? [`<${baseUrl}?page=${parsedPage + 1}&limit=${parsedLimit}>; rel="next"`] : []),
            //     ...(totalPages > 1 ? [`<${baseUrl}?page=${totalPages}&limit=${parsedLimit}>; rel="last"`] : [])
            // ];

            return {
                data: result,
                links: links
            };

        } finally {
            await db.client.close();
        }
    },

    fetchUserById: async function fetchUserById(id) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
            // return res.status(400).json({ errorMessage: "ID format is invalid" });
        }

        const db = await database.getDb();

        try {
            const filter = { _id: ObjectId.createFromHexString(id) };
                
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

    fetchUserByGithubId: async function fetchUserByGithubId(id) {
        const db = await database.getDb();

        try {
            const result = await db.collectionUsers.findOne(id);

            return result;
        } finally {
            await db.client.close();
        }
    },

    updateCompleteUserById: async function updateCompleteUserById(id, body) {
        if (!ObjectId.isValid(id)) {
            createError("ID format is invalid", 400);
        }

        if (!body.email || !body.role) {
            createError("email and role are required."
                + " Use patch method instead if you only want to update part of the user resource."
            , 400);
        }

        const db = await database.getDb();

        try {
            const filter = { _id: ObjectId.createFromHexString(id) };
                
            let result = await db.collectionUsers.findOne(filter);    

            if (!result) {
                createError(`user with ID: ${id} cannot be found`, 404);
            }

            const allowedProperties = ["firstname", "lastname",
                "email", "password", "role", "balance", "trip_history", "monthly_paid"];
            const reqProperties = Object.keys(body);
            const isInvalidUpdate = reqProperties.some(property =>
                !allowedProperties.includes(property));

            if (isInvalidUpdate) {
                createError("invalid update property key. This API only allow"
                    + " updates of already existing properties.", 400);
            }

            // const updateUser = {
            //     firstname: body.firstname || null,
            //     lastname: body.lastname || null,
            //     email: body.email,
            //     role: body.role,
            //     balance: body.balance || null,
            //     monthly_paid: body.monthly_paid || false
            // };

            const user = updateUser(body);

            if (body.trip_history) {
                user.trip_history = body.trip_history;
            }

            if (body.password) {
                user.password_hash = body.password;
            }

            result = await db.collectionUsers.updateOne(filter, { $set: user });

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
                _id: ObjectId.createFromHexString(id)
            };
                
            let result = await db.collectionUsers.findOne(filter);

            if (!result) {
                createError(`user with ID: ${id} cannot be found`, 404);
            }


            const allowedProperties = ["firstname", "lastname",
                "email", "monthly_paid", "role", "balance"];
            const reqProperties = Object.keys(body);
            const isInvalidUpdate = reqProperties.some(property =>
                !allowedProperties.includes(property));

            if (isInvalidUpdate) {
                createError("invalid update property key. This API only allow"
                    + " updates of already existing properties.", 400);
            }

            result = await db.collectionUsers.updateOne(filter, { $set: body });

            result = await db.collectionUsers.findOne(filter);

            return result;
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
            const filter = { _id: ObjectId.createFromHexString(id) };
                
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
        if (!body.email || !body.role) {
            createError("email and role are required.", 400);
        }

        const db = await database.getDb();

        try {
            const newUser = {
                firstname: body.firstname || null,
                lastname: body.lastname || null,
                email: body.email,
                role: body.role,
                balance: body.balance || null,
                monthly_paid: body.monthly_paid || false,
                githubId: body.githubId,
                username: body.username
            };
            console.log("newUser:", newUser, "END.");
            const email = newUser.email;

            if (email !== "No Email") {
                const duplicateUser = await db.collectionUsers.findOne({email});
    
                if (duplicateUser) {
                    createError("User with this email already exists.", 400);
                }
            }

            let result = await db.collectionUsers.insertOne(newUser);

            const filter = {
                _id: result.insertedId
            };

            result = await db.collectionUsers.findOne(filter);

            return result;
        } finally {
            await db.client.close();
        }
    }
};



export default userModel;
