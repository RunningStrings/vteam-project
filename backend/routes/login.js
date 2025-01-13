









import express from 'express';
import passport from 'passport';
import { generateJWT } from '../utils/jwtUtils.js';

const router = express.Router();

// Route to initiate GitHub OAuth authentication
router.get('/github', passport.authenticate('github', { scope: ['user'] }));

// Callback route after GitHub OAuth authentication
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Successfully authenticated, issue a JWT
    const user = req.user;
    const token = generateJWT(user);

    // Send the JWT token to the client
    res.json({ token });
  }
);

export default router;
