/**
 * RESTapi running on express server with a Mongodb database.
 *
 * @author Bikeriderz
 *
 */
import express from 'express';
import cors from 'cors';
import allRoutes from './routes/index.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import logIncomingToConsole from './middlewares/index.js';
// import database from './database-config/database.js';
// import database from './database.js';
import http from 'http'; // Needed for socket.io
// import { Server } from 'socket.io';
import { initializeSocket } from './socket.js';

const app = express();
const PORT = process.env.PORT || 5000;
const pathV1 = "/api/v1";

const server = http.createServer(app);
const io = initializeSocket(server);

app.use(express.json());
app.use(cors());

// io.on('connection', (socket) => {
//     console.log('A bike connected:', socket.id);

//     // Listen for events from the bike
//     socket.on('update-location', (data) => {
//         console.log('Location update:', data);
//     });

//     socket.on('update-speed', (data) => {
//         console.log('Speed update:', data);
//     });

//     socket.on('update-battery', (data) => {
//         console.log('Battery update:', data);
//     });

//     socket.on('log-trip', (data) => {
//         console.log('Trip log:', data);
//     });

//     socket.on('disconnect', () => {
//         console.log('A bike disconnected:', socket.id);
//     });
// });

// import { router as indexRouter } from './routes/index.js';
import { router as userRouter } from './routes/users.js';
import { router as cityRouter } from './routes/cities.js';
import { router as bikeRouter } from './routes/bikes.js';
import { router as stationRouter } from './routes/charging_stations.js';
import { router as zoneRouter } from './routes/parking_zones.js';
// import { router as rentRouter } from './routes/rents.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import logIncomingToConsole from './middlewares/index.js';

app.use("/users", userRouter);
app.use("/cities", cityRouter);
app.use("/bikes", bikeRouter);
app.use("/charging_stations", stationRouter);
app.use("/parking_zones", zoneRouter);
// app.use("/rents", rentRouter)
app.use(logIncomingToConsole);
app.use(errorMiddleware);
allRoutes(app, pathV1);

app.get('/', (req, res) => {
    res.send('Hello from the Backend!');
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

// Using separate port to make it easier to see bike-brain communication.
// Can be removed when not needed (socket runs on the regular backend port).
server.listen(5001, () => {
  console.log('Socket.IO server is running on http://localhost:5001');
});
