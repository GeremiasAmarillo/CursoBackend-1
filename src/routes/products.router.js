import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProducts,
  getProductsById,
  updateProduct,
} from "../controllers/products.js";

const productsRouter = Router();

// /= http://localhost:8080/products
productsRouter.get("/", getProducts);

productsRouter.get("/:pid", getProductsById);

productsRouter.post("/", addProduct);

productsRouter.put("/:pid", updateProduct);

productsRouter.delete("/:pid", deleteProduct);

export { productsRouter };
