import { response, request } from "express";
import { CartRepository, UserRepository } from "../repositories/index.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jsonWebToken.js";

export const loginUsuario = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;
    const usuario = await UserRepository.getUserEmail(email);
    if (!usuario)
      return res.status(400).json({ ok: false, msg: "Datos Incorrectos" });

    const validatePassword = isValidPassword(password, usuario.password);

    if (!validatePassword)
      return res.status(400).json({ ok: false, msg: "Datos Incorrectos" });
    const { _id, name, lastName, rol } = usuario;

    const token = generateToken({ _id, name, lastName, email, rol });

    return res.json({ ok: true, usuario, token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Contactar con un administrador" });
  }
};
export const createUsuario = async (req = request, res = response) => {
  try {
    req.body.password = createHash(req.body.password);
    const carrito = await CartRepository.newCart();
    if (!carrito) {
      return res
        .status(500)
        .json({ ok: false, msg: "No se pudo crear el carrito" });
    }

    req.body.cart_id = carrito._id;

    const usuario = await UserRepository.registerUser(req.body);
    const { _id, name, lastName, email, rol } = usuario;
    const token = generateToken({ _id, name, lastName, email, rol });
    return res.json({ ok: true, usuario, token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Contactar con un administrador" });
  }
};
