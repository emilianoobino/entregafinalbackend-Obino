

import dotenv from 'dotenv';

// Forzando la carga del archivo .env.development para depuración
dotenv.config({
    path: './.env.development',
});

// Imprimir todas las variables de entorno cargadas
console.log('Loaded Environment Variables:', process.env);

import passport from 'passport';
import jwt from 'passport-jwt';
import jwtSign from 'jsonwebtoken';
import { Strategy as GitHubStrategy } from 'passport-github2';
import CartServices from '../services/cartServices.js';
import UserModel from '../models/user.model.js';
import configObject from '../config/config.js';

const { Strategy: JWTStrategy, ExtractJwt } = jwt;
const { secret_cookie_token } = configObject;

// Verificar el valor de secret_cookie_token
console.log('Secret Cookie Token:', secret_cookie_token);

const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: secret_cookie_token,
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liDwc5CFBpLdz4i1",
        clientSecret: "219e89bad45bb1ae352a927f10b4cd6f6714f307",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const fullName = profile._json.name;
            const nameLength = fullName.length;
            const middleIndex = Math.floor(nameLength / 2);
            const firstName = fullName.slice(0, middleIndex);
            const lastName = fullName.slice(middleIndex);
            const newCart = await cartServices.createCart();
            let rol = 'User';
            let connection = new Date();
            let user = await UserModel.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: firstName,
                    last_name: lastName,
                    age: profile._json.public_repos,
                    email: profile._json.email,
                    password: "",
                    rol,
                    cart: newCart._id,
                    last_connection: connection
                };
                user = await UserModel.create(newUser);
            }
            const token = jwtSign.sign({ user: user }, secret_cookie_token, { expiresIn: '1h' });
            return done(null, token);
        } catch (err) {
            return done(err, null);
        }
    }));
};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['cookieAppStore'];
    }
    return token;
};

export default initializePassport;
