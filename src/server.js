import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import session from "express-session";
import MongoStorage from "connect-mongo";
import passport from "passport";
import "dotenv/config";
import { dbconnection } from "./database/config.js";
import { MessageModel } from "./daos/mongo/models/messages.models.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import { ProductRepository } from "./repositories/index.js";
import { initializarPassport } from "./config/passport.js";
import { productsRouter, cartsRouter, authRouter } from "./routes/index.js";

// Inicialización de la aplicación
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "localhost";

// Configuración del middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Configuración de express-session
app.use(
  session({
    store: MongoStorage.create({
      mongoUrl: `${process.env.URI_MONGO_DB}/${process.env.NAME_DB}`,
      ttl: 3600,
    }),
    secret: process.env.SECRET_SESSION,
    saveUninitialized: true,
    resave: false,
  })
);

// Inicializar Passport después de la sesión
initializarPassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/carts", cartsRouter);

// Conexión a la base de datos
await dbconnection();

// Iniciar el servidor
const expressServer = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://${HOST}:${PORT}`);
});

// Configuración de Socket.IO
const io = new Server(expressServer);

io.on("connection", async (socket) => {
  console.log("Usuario conectado");

  // Enviar productos al conectar el socket
  try {
    const limit = 50;
    const { payload } = await ProductRepository.getProducts({ limit });
    socket.emit("productos", payload);
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }

  // Agregar producto
  socket.on("agregarProducto", async (producto) => {
    try {
      const newProduct = await ProductRepository.addProduct(producto);
      if (newProduct) {
        const { payload: updatedProducts } =
          await ProductRepository.getProducts();
        io.emit("productos", updatedProducts);
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  // Eliminar producto
  socket.on("eliminarProducto", async (id) => {
    try {
      await ProductRepository.deleteProduct(id);
      const { payload: updatedProducts } =
        await ProductRepository.getProducts();
      io.emit("productos", updatedProducts);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });

  // Chat
  socket.on("message", async (data) => {
    try {
      const newMessage = await MessageModel.create({ ...data });
      if (newMessage) {
        const messages = await MessageModel.find();
        io.emit("messageLogs", messages);
      }
    } catch (error) {
      console.error("Error al crear mensaje:", error);
    }
  });

  // Notificar a otros usuarios sobre un nuevo usuario
  socket.broadcast.emit("nuevo_user");
});
