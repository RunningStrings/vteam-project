/**
 * RESTapi running on express server with a Mongodb database.
 *
 * @author Bikeriderz
 *
 */

import express from 'express';
import database from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// import { router as indexRouter } from './routes/index.js';
import { router as userRouter } from './routes/users.js';
// import { router as cityRouter } from './routes/cities.js';
// import { router as bikeRouter } from './routes/bikes.js';
// import { router as stationRouter } from './routes/stations.js';
// import { router as zoneRouter } from './routes/zones.js';
// import { router as rentRouter } from './routes/rents.js';
import logIncomingToConsole from './middlewear/index.js';

app.use("/users", userRouter)
// app.use("/cities", cityRouter)
// app.use("/bikes", bikeRouter)
// app.use("/stations", stationRouter)
// app.use("/zones", zoneRouter)
// app.use("/rents", rentRouter)
app.use(logIncomingToConsole);

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.get('/cities', async (req, res) => {
  try {
    const db = await database.getDb();
    const cities = await db.collectionCities.find().toArray();
    res.json(cities);
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

app.listen(PORT, logStartUpDetailsToConsole);
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

    console.info(`Server is listening on port ${PORT}.`);
    console.info("Available routes are:");
    console.info(routes);
}
