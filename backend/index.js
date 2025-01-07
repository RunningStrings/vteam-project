/**
 * RESTapi running on express server with a Mongodb database.
 *
 * @author Bikeriderz
 *
 */
import express from 'express';
import allRoutes from './routes/index.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import logIncomingToConsole from './middlewares/index.js';

const app = express();
const PORT = process.env.PORT || 5000;
const pathV1 = "/api/v1";

app.use(express.json());
app.use(logIncomingToConsole);
app.use(errorMiddleware);
allRoutes(app, pathV1);

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
