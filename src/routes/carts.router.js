import { Router } from "express";
import {
  getCartProducts,
  addProductInCart,
  deleteProductsInCart,
  updateProductInCart,
  deleteCart,
} from "../controllers/carts.js";
import { validateJWT } from "../middleware/auth.js";

const cartsRouter = Router();

cartsRouter.get("/:cid", validateJWT, getCartProducts);

cartsRouter.post("/:cid/products/:pid", validateJWT, addProductInCart);

cartsRouter.delete("/:cid/products/:pid", validateJWT, deleteProductsInCart);

cartsRouter.put("/:cid/products/:pid", validateJWT, updateProductInCart);

cartsRouter.delete("/:cid", validateJWT, deleteCart);

export { cartsRouter };
