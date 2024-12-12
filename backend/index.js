/**
 * RESTapi running on express server with a Mongodb database.
 *
 * @author Bikeriderz
 *
 */
"use strict";

import express from 'express';
import database from './database.js';

const app = express();
const PORT = process.env.PORT || 1337;

// const routeIndex = require("./route/index.js");
const userRouter = require("./routes/users")
const cityRouter = require("./routes/cities")
const bikeRouter = require("./routes/bikes")
const stationRouter = require("./routes/stations")
const zoneRouter = require("./routes/zones")
const rentRouter = require("./routes/rents")
const middleware = require("./middleware/index.js");

app.use("/users", userRouter)
app.use("/cities", cityRouter)
app.use("/bikes", bikeRouter)
app.use("/stations", stationRouter)
app.use("/zones", zoneRouter)
app.use("/rents", rentRouter)
app.use(middleware.logIncomingToConsole);

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.get('/users', async (req, res) => {
  try {
    const db = await database.getDb();
    const users = await db.collectionUsers.find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    // res.status(500).send('Server Error');
    res.status(500).json({ errorMessage: "Server Error" });
  }
});

app.get('/bikes', async (req, res) => {
  try {
    const db = await database.getDb();
    const bikes = await db.collectionBikes.find().toArray();
    res.json(bikes);
  } catch (error) {
    console.error('Error fetching bikes:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(port, logStartUpDetailsToConsole);
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

/**
 * Log app details to console when starting up.
 *
 * @return {void}
 */
function logStartUpDetailsToConsole() {
    let routes = [];

    // Find what routes are supported
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === "router") {
            // Routes added as router middleware
            middleware.handle.stack.forEach((handler) => {
                let route;

                route = handler.route;
                route && routes.push(route);
            });
        }
    });

    console.info(`Server is listening on port ${port}.`);
    console.info("Available routes are:");
    console.info(routes);
}
