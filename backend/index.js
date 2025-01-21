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
import setHeader from './middlewares/setHeader.js';
import logIncomingToConsole from './middlewares/index.js';
import { initializeSocket } from './socket.js';
import passport from 'passport';
import "./strategies/githubStrategy.js";
// import githubStrategy from './strategies/githubStrategy.js';
import tokenService from './services/tokenService.js';
import jwt from 'jsonwebtoken';
// import { error } from 'console';

const app = express();
const PORT = process.env.PORT || 5000;
const pathV1 = "/api/v1";
// Create and expose an HTTP server to enable Socket.IO to connect.
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(logIncomingToConsole);
app.use(setHeader);
app.use(passport.initialize());
// passport.use(githubStrategy);
// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((user, done) => done(null, user));
allRoutes(app, pathV1);

// The variable 'io' is used indirectly to hold the Socket.IO server instance,
// and is necessary for websocket functionality. Passing server as a parameter
// attaches Socket.IO to the backend server.
const io = initializeSocket(server);

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Welcome to our RESTful BikeAPI! Please refer to the documentation at GET /docs for usage details."
    });
});

// app.get('/github/oauth2/callback', (req, res) => {
    //     res.send('Hello from the Backend!');
    // });

// app.get('/api/v1/login', passport.authenticate('github', {
//     scope: ['user', 'user:email'],
//     session: false
// }));

app.get(
    "/github/oauth2/callback",
    passport.authenticate("github", {
        failureRedirect: '/',
        session: false
    }), (req, res, next) => {
        const userObject = req.user;
        const token = tokenService.generateToken(userObject);
        if (process.env.REDIRECT_URI_FRONTEND) {
            res.redirect(process.env.REDIRECT_URI_FRONTEND + `?token=${token}&role=${userObject.user.role}`);
        }
        res.status(200).json({
            data: {
                token: token,
                role: userObject.user.role
            }
        });
    }
);

app.use(errorMiddleware);
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// Updated to use the same port and server instance for both server and Socket.IO.
server.listen(PORT, () => {
    console.log(`Server and Socket.IO are running on port ${PORT}`);
});
