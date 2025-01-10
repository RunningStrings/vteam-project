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
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(logIncomingToConsole);
app.use(errorMiddleware);
allRoutes(app, pathV1);
initializeSocket();

app.get('/', (req, res) => {
    res.send('Hello from the Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Using separate port to make it easier to see bike-brain communication.
// Can be removed when not needed (socket runs on the regular backend port).
server.listen(5001, () => {
    console.log('Socket.IO server is running on http://localhost:5001');
});
