import { request, response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const auth = (req = request, res, next) => {
  if (req.session?.user) {
    return next();
  }

  return res.redirect("/login");
};

export const admin = (req = request, res, next) => {
  if (req.session?.user.rol === "admin") {
    return next();
  }

  return res.redirect("/");
};

export const validarCampos = (req = request, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }
  next();
};

export const validateJWT = async (req, res, next) => {
  const token = req.headers["x-token"];

  if (!token) {
    return res.status(401).json({ msg: "No se proporcionó token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};
