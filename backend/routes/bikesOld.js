// /**
//  * Route for bikes.
//  */
// import express from 'express';
// import database from '../database.js';
// import { ObjectId } from 'mongodb';

// const router = express.Router();

// router
//     .route("/")
//     .get(async (req, res) => {
//         try {
//             const db = await database.getDb();
//             const bikes = await db.collectionBikes.find().toArray();
//             res.json(bikes);
//         } catch (error) {
//         console.error('Error get bikes:', error);
//         res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
//         }
//     })
//     .post(async (req, res) => {
//         try {
//             const { city_id, location, bikes, capacity } = req.body;

//             if (!city_id || !location) {
//                 return res.status(400).json({ errorMessage: `CityID and location are required.` });
//             }

//             const db = await database.getDb();
//             const duplicateBike = await db.collectionBikes.findOne({ location });

//             if (duplicateBike) {
//                 return res.status(400).json({ errorMessage: "Bike with this location already exists." });
//             }

//             const results = await db.collectionBikes.insertOne({
//                 city_id, location
//             });

//             res.status(201).json({ 
//                 message: 'A new bike has been added',
//                 bikeInformation:
//                     `New Id: ${results.insertedId},
//                     City ID: ${city_id},
//                     Location: ${location}`
//                 });
//         } catch (error) {
//         console.error('Error post bikes:', error);
//         res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
//         }
//     });

// router
//     .route("/:id")
//     .get(async (req, res) => {
//         try {
//             const db = await database.getDb();
//             const bikeId = req.params.id;

//             if (!ObjectId.isValid(bikeId)) {
//                 return res.status(400).json({ errorMessage: "ID format is invalid" });
//             }

//             const objectId = new ObjectId(bikeId);
//             const bike = await db.collectionBikes.findOne({ _id: objectId });

//             if (!bike) {
//                 return res.status(404).json({ errorMessage: "Bike can not be found.",
//                     objectId: bikeId
//                 }
//                 );
//             }
//             res.status(200).json(bike);
//         } catch (error) {
//             console.error('Error get one bike:', error);
//             res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
//         }
//     })
//     .patch(async (req, res) => {
//         try {
//             const db = await database.getDb();
//             const bikeId = req.params.id;
//             const update = req.body;

//             if (!ObjectId.isValid(bikeId)) {
//                 return res.status(400).json({ errorMessage: "ID format is invalid" });
//             }

//             const objectId = new ObjectId(bikeId);
//             const bike = await db.collectionBikes.findOne({ _id: objectId });

//             if (!bike) {
//                 return res.status(404).json({ errorMessage: "Bike can not be found.",
//                     objectId: bikeId
//                 });
//             }

//             const results = await db.collectionBikes.updateOne(
//                 { _id: objectId },
//                 { $set: update }
//             );

//             if (results.modifiedCount !== 1) {
//                 return res.status(400).json({
//                     errorMessage: "Fail. No update possible with the given information.",
//                     objectId: bikeId
//                 });
//             }

//             const updatedBike = await db.collectionBikes.findOne({ _id: objectId });
//             return res.status(200).json(updatedBike);
//         } catch (error) {
//             console.error('Error patch one bike:', error);
//             res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
//         }
//     })
//     .delete(async (req, res) => {
//         try {
//             const db = await database.getDb();
//             const bikeId = req.params.id;

//             if (!ObjectId.isValid(bikeId)) {
//                 return res.status(400).json({ errorMessage: "ID format is invalid" });
//             }

//             const objectId = new ObjectId(bikeId);
//             const bike = await db.collectionBikes.findOne({ _id: objectId });

//             if (!bike) {
//                 return res.status(404).json({ errorMessage: "Bike can not be found.",
//                     objectId: bikeId
//                 });
//             }

//             const results = await db.collectionBikes.deleteOne( { _id: objectId } );

//             if (results.deletedCount !== 1) {
//                 return res.status(400).json({
//                     errorMessage: "Fail. No delete possible with the given information.",
//                     objectId: bikeId
//                 });
//             }

//             return res.status(200).json({
//                 message: "Success. Bike deleted.",
//                 objectId: bikeId
//             });
//         } catch (error) {
//             console.error('Error delete one bike:', error);
//             res.status(error.status || 500).json({ errorMessage: error.message || "Server Error" });
//         }
//     });

// export { router };
