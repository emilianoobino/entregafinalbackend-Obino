import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import http from 'http';
import expressHandlebars from 'express-handlebars';
import { Server as SocketIOServer } from 'socket.io';
import morgan from 'morgan';

import logger from './utils/logger.js';
import handleError from './middleware/handleError.js';
import handleLogger from './middleware/handleLogger.js';
import authMiddleware from './middleware/auth.js';
import initializePassport from './config/passport.config.js';
import { swaggerUi, specs } from './config/swagger.config.js';

import UserModel from './models/user.model.js';
import ProductController from './controllers/product.controller.js';
import CartController from './controllers/cart.controller.js';
import UserController from './controllers/user.controller.js';
import ViewsController from './controllers/views.controller.js';
import MockingController from './controllers/mocking.controller.js';
import LoggerController from './controllers/logger.controller.js';
import SocketManager from './sockets/socketManager.js';

import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import usersRouter from './routes/users.router.js';
import mockingRouter from './routes/mocking.router.js';
import loggerRouter from './routes/logger.router.js';

// Variables de entorno
dotenv.config();
const { APP_PORT, APP_HOST, MONGO_URL, SECRET_COOKIE_TOKEN, NODE_ENV } = process.env;

// Servidor
const app = express();
const server = http.createServer(app);
const PORT = APP_PORT || 8080;

// Instancias de las Clases
const productController = new ProductController();
const cartController = new CartController();
const userController = new UserController();
const viewsController = new ViewsController();
const mockingController = new MockingController();
const loggerController = new LoggerController();

// Middlewares
app.use(handleLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: SECRET_COOKIE_TOKEN,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        ttl: 3600,
    }),
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Logger para solicitudes HTTP
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', { stream: logger.stream }));
}

// Handlebars
const hbs = expressHandlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Variables globales para el sitio
app.use(async (req, res, next) => {
    res.locals.user = req.user;
    if (req.user && req.user.role !== 'admin') {
        const user = await UserModel.findOne({ _id: req.user._id }).populate("cart");
        const usercartProducts = user.cart.products;
        let productos = 0;
        for (let y = 0; y < usercartProducts.length; y++) {
            productos += usercartProducts[y].quantity;
        }
        res.locals.cartQuantity = productos;
    } else {
        res.locals.cartQuantity = 0;
    }
    res.locals.isUserPremium = req.user && req.user.role === 'premium';
    res.locals.isUserAdmin = req.user && req.user.role === 'admin';
    next();
});

// Rutas
app.use('/', viewsRouter(viewsController));
app.use('/api/products', productsRouter(productController));
app.use('/api/carts', cartRouter(cartController));
app.use('/api/users', usersRouter(userController));
app.use('/mockingproducts', mockingRouter(mockingController));
app.use('/loggertest', loggerRouter(loggerController));
app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.static('./src/public'));
app.use(handleError);

// Configuración de manejo de errores 404
app.use((req, res, next) => {
    res.status(404).render('notFound', { title: 'Page Not Found' });
});

// Configuración de Socket.io
const io = new SocketIOServer(server);
new SocketManager(io);

// Conexión a MongoDB
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => logger.info('Connected to MongoDB'))
    .catch(error => logger.error('MongoDB connection error:', error));

// Inicialización del servidor HTTP
server.listen(PORT, APP_HOST, () => {
    logger.info(`Server is running at http://${APP_HOST}:${PORT}`);
});

// Manejo de eventos no capturados
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});




