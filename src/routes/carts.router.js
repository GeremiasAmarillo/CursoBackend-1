import express from "express";
import {
  getCartProducts,
  newCart,
  addProductToCart,
} from "../controllers/carts.js";

const cartsRouter = express.Router();

cartsRouter.post("/", newCart);

cartsRouter.get("/:cid", getCartProducts);

cartsRouter.post("/:cid/products/:pid", addProductToCart);

export { cartsRouter };
