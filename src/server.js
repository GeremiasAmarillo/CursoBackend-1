import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import "dotenv/config";
import { dbconnection } from "./database/config.js";
import { productModel } from "./models/products.js";
import { MessageModel } from "./models/messages.js";
import viewsRouter from "./routes/views.router.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import __dirname from "./utils.js";
import {
  addProductServices,
  getProductsServices,
} from "./services/products.service.js";

// Inicialización de la aplicación
const app = express();
const PORT = process.env.PORT || 3000; // Valor predeterminado si no está en el archivo .env
const HOST = "localhost";

// Configuración del middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
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
  try {
    // Enviar productos al conectar el socket
    const { payload } = await getProductsServices();
    socket.emit("productos", payload);

    // Agregar producto
    socket.on("agregarProducto", async (producto) => {
      try {
        const newProduct = await addProductServices(producto);
        if (newProduct) {
          const { payload: updatedProducts } = await getProductsServices();
          io.emit("productos", updatedProducts);
        }
      } catch (error) {
        console.error("Error al agregar producto:", error);
      }
    });

    // Eliminar producto
    socket.on("eliminarProducto", async (id) => {
      try {
        const result = await productModel.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
          const { payload: updatedProducts } = await getProductsServices();
          io.emit("productos", updatedProducts);
          console.log("Producto eliminado con éxito:", id);
        } else {
          console.error("Producto no encontrado para eliminar:", id);
        }
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
  } catch (error) {
    console.error("Error en la conexión de Socket.IO:", error);
  }
});
