import { Router } from "express";
import { check } from "express-validator";
import { createUsuario, loginUsuario } from "../controllers/auth.js";
import { validarCampos } from "../middleware/auth.js";
import { existeEmail } from "../helpers/db.validations.js";

const router = Router();

router.post(
  "/login",
  [
    check("email", "El email no tiene un formato correcto").isEmail(),
    check("password", "El password es obligatorio").isLength({ min: 6 }),
    validarCampos,
  ],
  loginUsuario
);

router.post(
  "/register",
  [
    check("name", "El campo name es obligatorio").notEmpty(),
    check("lastName", "El campo lastName es obligatorio").notEmpty(),
    check("email", "El email es obligatorio").notEmpty(),
    check("email", "El email no tiene un formato correcto").isEmail(),
    check("email").custom(existeEmail),
    check(
      "password",
      "El password es obligatorio (Debe tener mínimo 6 caracteres)"
    ).isLength({ min: 6 }),
    validarCampos,
  ],
  createUsuario
);

export { router as authRouter };
