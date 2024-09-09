import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProducts,
  getProductsById,
  updateProduct,
} from "../controllers/products.js";
import { validarCampos, validateJWT } from "../middleware/auth.js";
import { check } from "express-validator";
import { existeCode } from "../helpers/db.validations.js";

const productsRouter = Router();

// /= http://localhost:8080/products
productsRouter.get("/", validateJWT, getProducts);
productsRouter.get("/:pid", validateJWT, getProductsById);
productsRouter.post(
  "/",
  [
    validateJWT,
    check("title", "El campo title es obligatorio ").not().isEmpty(),
    check("description", "El campo description es obligatorio ")
      .not()
      .isEmpty(),
    check("price", "El campo price es obligatorio ")
      .not()
      .isEmpty()
      .isNumeric(),
    check("code", "El campo code es obligatorio y de tipo numerico ")
      .not()
      .isEmpty(),
    check("code").custom(existeCode),
    check("stock", "El campo stock es obligatorio y de tipo numerico")
      .not()
      .isEmpty()
      .isNumeric(),
    check("category", "El campo category es obligatorio ").not().isEmpty(),
    validarCampos,
  ],
  addProduct
);
productsRouter.put("/:pid", [validarCampos, validateJWT], updateProduct);
productsRouter.delete("/:pid", validateJWT, deleteProduct);

export { productsRouter };
