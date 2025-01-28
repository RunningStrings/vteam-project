/**
 * RESTapi running on express server with a Mongodb database.
 *
 * @author Bikeriderz
 *
 */
import express from "express";
import cors from "cors";
import http from "http"; // Needed for socket.io
import allRoutes from "./routes/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import setHeader from "./middlewares/setHeader.js";
import logIncomingToConsole from "./middlewares/index.js";
import { initializeSocket } from "./socket.js";
import passport from "passport";
import "./strategies/githubStrategy.js";
import tokenService from "./services/tokenService.js";

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
allRoutes(app, pathV1);

// The variable 'io' is used indirectly to hold the Socket.IO server instance,
// and is necessary for websocket functionality. Passing server as a parameter
// attaches Socket.IO to the backend server.
const io = initializeSocket(server);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to our RESTful BikeAPI! Please refer to the documentation at GET /docs for usage details."
    });
});

app.get("/docs", (req, res) => {
    res.redirect("https://documenter.getpostman.com/view/40462903/2sAYQdj9je");
});

app.get(
    "/github/oauth2/callback",
    passport.authenticate("github", {
        failureRedirect: "/",
        session: false
    }), (req, res, next) => {
        try {
            const userObject = req.user;
            const token = tokenService.generateToken(userObject);
            const stateParam = req.query.state;
            const decodedState = decodeURIComponent(stateParam);

            // console.log("Decoded state:", decodedState);
            // console.log(stateParam);
            // console.log(decodedState);

            if (decodedState === "bike") {
                return res.status(200).json({
                    data: {
                        token: token,
                        role: userObject.user.role,
                        state: decodedState
                    }});
            }

            const redirectUrl = `${decodedState}?token=${token}&role=${userObject.user.role}&id=${userObject.user._id}`;
            return res.redirect(redirectUrl);

        }  catch (error) {
            console.error("Error github", error);
            next(error);
        }
    }
);

app.use(errorMiddleware);

// Updated to use the same port and server instance for both server and Socket.IO.
server.listen(PORT, () => {
    console.log(`Server and Socket.IO are running on port ${PORT}`);
});
