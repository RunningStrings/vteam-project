/**
 * Model for users. Stores helper functions for users route.
 */
import database from './../database.js';

const userModel = {
    fetchUserById: async function fetchUserById(id) {
        const db = await database.getDb();

        try {
            const filter = {
                id: id
            };

            const result = await db.collectionUsers.findOne(filter);

            return result;
        } catch (error) {
            throw new Error(error.message ? error.message : "Database error");
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
