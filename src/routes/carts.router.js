import { Router } from "express";
import { cartManager } from "../server.js";

const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
  try {
    const response = await cartManager.newCart();
    res.json(response);
  } catch (error) {
    res.send("Error al crear el carrito");
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartManager.getCartProducts(cid);
    res.json(response);
  } catch (error) {
    res.send("No se pudieron mandar los productos al carrito");
  }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartManager.addProductToCart(cid, pid);
    res.json("Producto agregado con exito");
  } catch (error) {
    res.json("Error al guardar el producto en el carrito");
  }
});

export { cartsRouter };
