import express from "express";
import {
  getCartProducts,
  newCart,
  addProductToCart,
  deleteProductsInCart,
  updateProductInCart,
  deleteCart,
} from "../controllers/carts.js";

const cartsRouter = express.Router();

cartsRouter.post("/", newCart);

cartsRouter.get("/:cid", getCartProducts);

cartsRouter.post("/:cid/products/:pid", addProductToCart);

cartsRouter.delete("/:cid/products/:pid", deleteProductsInCart);

cartsRouter.put("/:cid/products/:pid", updateProductInCart);

cartsRouter.delete("/:cid", deleteCart);

export { cartsRouter };
