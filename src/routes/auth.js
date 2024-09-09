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
    validarCampos, // Verifica los errores antes de llamar a loginUsuario
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
    check("email").custom(existeEmail), // Verifica si el email ya existe en la base de datos
    check(
      "password",
      "El password es obligatorio (Debe tener mínimo 6 caracteres)"
    ).isLength({ min: 6 }),
    validarCampos, // Verifica los errores antes de llamar a createUsuario
  ],
  createUsuario
);

export { router as authRouter };
