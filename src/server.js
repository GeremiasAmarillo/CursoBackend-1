import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import "dotenv/config";
import { ProductManager } from "./model.manager/productManager.js";
import { CartManager } from "./model.manager/cartManager.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import { dbconnection } from "./database/config.js";
import { productModel } from "./models/products.js";
import { MessageModel } from "./models/messages.js";

const p = new ProductManager();
const PORT = process.env.PORT;
const HOST = "localhost";

const app = express();
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

export const productManager = new ProductManager();
export const cartManager = new CartManager();

app.use(express.json());
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

dbconnection();

const expressServer = app.listen(PORT, () => {
  console.log(`Ejecutándose en http://${HOST}:${PORT}`);
});

const io = new Server(expressServer);

io.on("connection", async (socket) => {
  const sendProducts = async () => {
    try {
      const productos = await productModel.find();
      socket.emit("productos", productos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  sendProducts();

  socket.on("agregarProducto", async (producto) => {
    try {
      const newProduct = await productModel.create({ ...producto });
      if (newProduct) {
        sendProducts();
        console.log("Producto agregado:", newProduct);
      } else {
        console.error("Error al agregar producto.");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  socket.on("eliminarProducto", async (id) => {
    try {
      const result = await productModel.deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        sendProducts();
        console.log("Producto eliminado con éxito:", id);
      } else {
        console.error("Producto no encontrado para eliminar:", id);
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });

  // chat
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

  socket.broadcast.emit("nuevo_user");
});
