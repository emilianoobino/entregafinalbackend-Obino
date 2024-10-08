import express from "express";
import exphbs from "express-handlebars";
import Handlebars from 'handlebars';
import MongoStore from "connect-mongo";
import session from "express-session";
import configObject from "./config/config.js";
import SocketService from "./services/socket.service.js";
import './utils/handlebars-helpers.js';
import "./database.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import errorHandler from "./middlewares/errors/index.js";
import addLogger from "./utils/logger.js";
import swaggerUiExpress from "swagger-ui-express";
import specs from "./config/swagger.config.js";

import cartsRouter from "./routes/carts.routes.js";
import productsRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";
import chatRouter from "./routes/chat.routes.js";
import usersRouter from "./routes/user.routes.js";
import sessionsRouter from "./routes/session.routes.js";


// Defino variables e instancio clases
const PUERTO = configObject.PORT;
const app = express();

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
});

// Inicializo el servicio de socket.io
const socketService = new SocketService(httpServer);
const io = socketService.io;

// Middleware para inyectar io en req (para que pueda estar disponible en toda la app)
app.use((req, res, next) => {
    req.io = io;
    next();
});


// Configuro Middlewares
import auth from "./middlewares/auth.js";
app.use("/", auth);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(express.static("./src/public/img"));
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://chaval198678:tonyfunko@cluster0.6l6psjf.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0`,
        ttl: 3600
    }),
    cookie: {secure:false}
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler);
app.use(addLogger);





// Configuro express-handlebars
const hbs = exphbs.create({
    handlebars: Handlebars
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Configuro Rutas
app.use("/", viewsRouter);
app.use("/chat", chatRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));



// Manejador de errores
app.use(errorHandler);





