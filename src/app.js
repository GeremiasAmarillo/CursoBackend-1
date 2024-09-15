import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

import ProductManager from "./dao/db/product-manager-db.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import usersRouter from "./routes/users.router.js";

import cookieParser from "cookie-parser";

import connectDB from './config/database.js';

import passport from "passport";
import initializePassport from './config/passport.config.js';

connectDB();

const app = express();
const PORT = 8080;

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

const hbs = engine({
    helpers: {
        gt: function (a, b) {
            return a > b;
        },
        ifEquals: function (arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        }
    },
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: './src/views/layouts/',
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", usersRouter);

app.use("/", viewsRouter);

app.set("socketio", io);

httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

io.on("connection", async (socket) => {
    console.log('Cliente conectado');

    let currentPage = 1;
    const limit = 10;

    const products = await ProductManager.getProducts({ limit, page: currentPage });
    socket.emit('products', products.docs, products.totalPages, currentPage);

    socket.on('requestProductsPage', async (page) => {
        const products = await ProductManager.getProducts({ limit, page });
        socket.emit('paginatedProducts', products.docs, products.totalPages, page);
    });

    socket.on('addProduct', async (productData) => {
        await ProductManager.addProduct(productData);
        const updatedProducts = await ProductManager.getProducts({ limit, page: currentPage });
        io.emit('products', updatedProducts.docs, updatedProducts.totalPages, currentPage);
    });

    socket.on('deleteProduct', async (productId) => {
        await ProductManager.deleteProduct(productId);
        const updatedProducts = await ProductManager.getProducts({ limit, page: currentPage });
        io.emit('products', updatedProducts.docs, updatedProducts.totalPages, currentPage);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});
