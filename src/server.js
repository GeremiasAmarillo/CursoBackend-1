import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { ProductManager } from "./model.manager/productManager.js";
import { CartManager } from "./model.manager/cartManager.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";

const p = new ProductManager();
const PORT = 8080;
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

const expressServer = app.listen(PORT, () => {
  console.log(`Ejecutandose en http://${HOST}:${PORT}`);
});

const socketServer = new Server(expressServer);

// Dentro del evento de conexión en tu servidor
socketServer.on("connection", (socket) => {
  const sendProducts = async () => {
    try {
      const productos = await p.getProducts(); // Obtener productos desde tu gestor de productos
      socket.emit("productos", productos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  sendProducts();

  socket.on("agregarProducto", async (producto) => {
    try {
      const result = await p.addProduct({ ...producto });
      if (result) {
        sendProducts();
        console.log("Producto agregado:", result);
      } else {
        console.error("Error al agregar producto.");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });
});
