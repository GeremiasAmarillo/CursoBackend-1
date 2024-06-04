import express from "express";
import { ProductManager } from "./model.manager/productManager.js";
import { CartManager } from "./model.manager/cartManager.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";

const PORT = 8080;
const HOST = "localhost";

const app = express();

export const productManager = new ProductManager();
export const cartManager = new CartManager();

app.use(express.json());
app.use("/api/products", productsRouter); //http://localhost:PORT/products
app.use("/api/carts", cartsRouter);

app.listen(PORT, (req, res) => {
  console.log(`Ejecutandose en http://${HOST}:${PORT}`);
});
