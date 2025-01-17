import passport from "passport";
import { Strategy as GitHubStrategy } from 'passport-github2';
// import tokenService from '../services/tokenService.js'
// import { OAuth2Strategy as GitHubStrategy } from 'passport-github2';
import userModel from '../models/userModel.js';
// import * as dotenv from 'dotenv';
// dotenv.config();
import 'dotenv/config';

// passport.serializeUser((user, done) => {
// 	done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
// 	try {
// 		const user = await userModel.fetchUserById(id);
// 		return user ? done(null, user) : done(null, null);
// 	} catch (err) {
// 		done(err, null);
// 	}
// })

// Serialize and deserialize user (required by Passport)
// passport.serializeUser((user, done) => {
//     done(null, user);
// });
  
// passport.deserializeUser((user, done) => {
//     done(null, user);
// });

export default passport.use(
        new GitHubStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            // callbackURL: process.env.REDIRECT_URI,
            // clientID: "Ov23li9ndlwDmCu3NI3W",
            // clientSecret: "ceb6c2e1c5fb2099f5a9ab839b6a1a2e30da204f",
            callbackURL: process.env.callbackURL || "http://localhost:5000/github/oauth2/callback",
            scope: ['user', 'user:email'],
            session: false
        },
        async (accessToken, refreshToken, profile, done) => {
            let user;
            try {
                user = await userModel.fetchUserByGithubId({ githubId: profile.id });
            } catch (err) {
                return done(err, null);
            }
            try {
                if (!user) {
                    const fullName = profile.displayName || profile.name || "Missing Missing";
                    const nameParts = fullName.split(" ");
                    user = {
                        firstname: nameParts[0],
                        lastname: nameParts[1],
                        email: profile.emails[0]?.value || "No Email",
                        password_hash: "",
                        role: "customer",
                        balance: null,
                        trip_history: [],
                        githubId: profile.id || null,
                        username: profile.username || null,
                    };
                    const newSavedUser = await userModel.createUser(user);
                    // const jwt = tokenService.generateToken(newSavedUser);
                    return done(null, { newSavedUser });
                    // return done(null, newSavedUser);
                }
                // user.accessToken = accessToken;
                // const jwt = tokenService.generateToken(user);
                return done(null, { user });
            } catch (error) {
            console.error('Error storing user in DB:', error);
            return done(error, null);
            }
        }
    )
);

// export default githubStrategy;



// import { generateJWT } from './utils/jwtUtils';  // Utility to generate JWT
// import { OAuth2Strategy as GitHubStrategy } from 'passport-github2';
// import User from './models/User';  // MongoDB User model

// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: process.env.GITHUB_CALLBACK_URL
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         let user = await User.findOne({ githubId: profile.id });

//         if (!user) {
//             user = new User({
//                 githubId: profile.id,
//                 username: profile.username,
//                 email: profile.emails[0]?.value,
//                 avatarUrl: profile.photos[0]?.value,
//                 accessToken,
//             });
//             await user.save();
//         } else {
//             user.accessToken = accessToken;  // Update the GitHub access token
//             await user.save();
//         }

//         // After user is authenticated, generate a JWT for your application
//         const jwt = generateJWT(user);  // Generate JWT containing user data
//         return done(null, { user, jwt });  // Send JWT back to the client
//     } catch (error) {
//         return done(error, null);
//     }
// }));