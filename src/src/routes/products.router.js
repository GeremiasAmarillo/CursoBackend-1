import { Router } from "express";
import ProductController from "../controllers/products.controller.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:pid", ProductController.getProductById);
router.post("/", ProductController.addProduct);
router.put("/:pid", ProductController.updateProduct);
router.delete("/:pid", ProductController.deleteProduct);

export default router;
