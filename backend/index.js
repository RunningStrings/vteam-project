/**
 * RESTapi running on express server with a Mongodb database.
 *
 * @author Bikeriderz
 *
 */
import express from 'express';
// import database from './database-config/database.js';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

// import { router as indexRouter } from './routes/index.js';
import { router as userRouter } from './routes/users.js';
import { router as cityRouter } from './routes/cities.js';
import { router as bikeRouter } from './routes/bikes.js';
import { router as stationRouter } from './routes/chargingStations.js';
import { router as zoneRouter } from './routes/parkingZones.js';
import { router as tripRouter } from './routes/trips.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import logIncomingToConsole from './middlewares/index.js';

// const pathV1 = "/api/v1";
app.use("/users", userRouter);
app.use("/cities", cityRouter);
app.use("/bikes", bikeRouter);
app.use("/charging_stations", stationRouter);
app.use("/parking_zones", zoneRouter);
app.use("/trips", tripRouter)
app.use(logIncomingToConsole);
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
