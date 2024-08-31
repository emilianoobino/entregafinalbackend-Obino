import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import configObject from "./config.js";

// Importo Modelo y funciones de bcrypt
import UsuarioModel from "../models/usuario.model.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";

import { CartController } from "../controllers/cart.controller.js";

const cartController = new CartController();

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    // Armo mis estrategias de registro y login
    passport.use("register", new LocalStrategy({
        // Accedo al objeto request
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            // Verificamos si ese email ya existe
            let usuario = await UsuarioModel.findOne({ email });

            if (usuario) {
                return done(null, false);
            }

            // Si no existe instancio un carrito y creo un registro nuevo
            const newCart = await cartController.addCart();

            let nuevoUsuario = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                avatar_url: "/img/generic_avatar.jpeg",
                cart: newCart.payload._id,
                role: "user"
            }
            let resultado = await UsuarioModel.create(nuevoUsuario);
            return done(null, resultado);
            // Si todo está bien mandamos done con el usuario generado.
            
        } catch (error) {
            console.log(error);
            return done(error);
        }
    }))

    // Agrego la estrategia de Login
    passport.use("login", new LocalStrategy({
        usernameField: "email",
    }, async (email, password, done) => {
        try {
            let usuario = await UsuarioModel.findOne({ email });

            // Si no existe devuelvo error
            if (!usuario) {
                console.log("Usuario inexistente");
                return done(null, false);
            }

            // Si existe verifico password
            if (!isValidPassword(password, usuario)) {
                return done(null, false);
            }

            return done(null, usuario);
        } catch (error) {
            return done(error);
        }
    }))


    //Serializar y deserializar
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (user, done) => {
        let usuario = await UsuarioModel.findById(user._id);
        done(null, usuario)
    })



    // Genero estrategias de auth con GitHub
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liDwc5CFBpLdz4i1",
        clientSecret: "219e89bad45bb1ae352a927f10b4cd6f6714f307",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {

        try {
            const email = (profile.emails && profile.emails[0].value) || profile._json.email;
            if (!email) {
                return done(new Error('No se pudo obtener el email del perfil de GitHub.'));
            }

            let usuario = await UsuarioModel.findOne({ email });
            if (!usuario) {
                const response = await cartController.addCart();
                if (!response.success) {
                    return done(new Error(response.message));
                }

                let nuevoUsuario = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 0,
                    email,
                    password: "",
                    cart: response.cart,
                    role: "user"
                }


                let resultado = await UsuarioModel.create(nuevoUsuario);

                done(null, resultado);
            } else {
                console.log(usuario);

                done(null, usuario);
            }
        } catch (error) {
            console.log(error);
            return done(error);
        }
    }))
}

export default initializePassport;