/**
 * RESTapi running on express server with a Mongodb database.
 *
 * @author Bikeriderz
 *
 */
import express from 'express';
import cors from 'cors';
import http from 'http'; // Needed for socket.io
import allRoutes from './routes/index.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import logIncomingToConsole from './middlewares/index.js';
import { initializeSocket } from './socket.js';

const app = express();
const PORT = process.env.PORT || 5000;
const pathV1 = "/api/v1";
// Create and expose an HTTP server to enable Socket.IO to connect.
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(logIncomingToConsole);
app.use(errorMiddleware);
allRoutes(app, pathV1);

// The variable 'io' is used indirectly to hold the Socket.IO server instance,
// and is necessary for websocket functionality. Passing server as a parameter
// attaches Socket.IO to the backend server.
const io = initializeSocket(server);

app.get('/', (req, res) => {
    res.send('Hello from the Backend!');
});

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// Updated to use the same port and server instance for both server and Socket.IO.
server.listen(PORT, () => {
    console.log(`Server and Socket.IO are running on http://localhost:${PORT}`);
});
