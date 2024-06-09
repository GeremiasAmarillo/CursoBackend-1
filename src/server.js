import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

import { ProductManager } from "./model.manager/productManager.js";
import { CartManager } from "./model.manager/cartManager.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";

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
app.use("/api/products", productsRouter); //http://localhost:PORT/products
app.use("/api/carts", cartsRouter);

const expressServer = app.listen(PORT, (req, res) => {
  console.log(`Ejecutandose en http://${HOST}:${PORT}`);
});

const socketServer = new Server(expressServer);

socketServer.on("connection", (socket) => {
  console.log("Cliente conectado desde el front");
});

{
  /* <script src="/socket.io/socket.io.js"></script>
    <script src="/js/index.js"></script> */
}
