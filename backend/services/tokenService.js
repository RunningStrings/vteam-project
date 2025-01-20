import 'dotenv/config';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || "bikeriderz12345!";

const tokenService = {
    generateToken: function generateToken(user) {
        const token = jwt.sign(user, secret, { expiresIn: '7d'});
        // console.log('GENERATED TOKEN ');
        // console.log(token);
        return token;
        // return jwt.sign(user, secret, { expiresIn: '6h'});
    },

    verifyToken: function verifyToken(token) {
        // console.log('THE TOKEN IN VERIFYTOKEN:');
        // console.log(token);
        return jwt.verify(token, secret);
    }
};

export default tokenService;
