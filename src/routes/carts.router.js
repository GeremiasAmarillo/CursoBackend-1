import express from "express";
import {
  getCartProducts,
  newCart,
  addProductInCart,
  deleteProductsInCart,
  updateProductInCart,
  deleteCart,
} from "../controllers/carts.js";

const cartsRouter = express.Router();

cartsRouter.post("/", newCart);

cartsRouter.get("/:cid", getCartProducts);

cartsRouter.post("/:cid/products/:pid", addProductInCart);

cartsRouter.delete("/:cid/products/:pid", deleteProductsInCart);

cartsRouter.put("/:cid/products/:pid", updateProductInCart);

cartsRouter.delete("/:cid", deleteCart);

export { cartsRouter };
