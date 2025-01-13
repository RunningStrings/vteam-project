import 'dotenv/config';

import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

const tokenService = {
    generateToken: function generateToken(email) {
        return jwt.sign(email, secret, { expiresIn: '1h'});
    }
};

export default tokenService;






import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateJWT = (user) => {
  const payload = {
    githubId: user.githubId,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };

  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION });
};

export const verifyJWT = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};
