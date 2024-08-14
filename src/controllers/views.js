import { request, response } from "express";
import { getProductsServices } from "../services/products.service.js";
import { getCartProductsService } from "../services/carts.service.js";
import { getUserEmail, registerUser } from "../services/user.service.js";

export const homeView = async (req = request, res = response) => {
  try {
    const limit = 50;
    const { payload } = await getProductsServices({ limit });

    const user = req.session.user;

    return res.render("home", {
      productos: payload,
      styles: "style.css",
      user,
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).send("Error al obtener los productos");
  }
};

export const realTimeProductsView = async (req = request, res = response) => {
  const user = req.session.user;

  return res.render("realTimeProducts", { user });
};

export const chatView = async (req = request, res = response) => {
  const user = req.session.user;

  return res.render("chat", { user });
};

export const productView = async (req = request, res = response) => {
  const user = req.session.user;

  const result = await getProductsServices({ ...req.query });
  return res.render("products", { title: "productos", result, user });
};

export const cartView = async (req = request, res = response) => {
  const user = req.session.user;

  const { cid } = req.params;
  const carrito = await getCartProductsService(cid);
  return res.render("cart", { title: "carrito", carrito, user });
};

export const loginGet = async (req = request, res = response) => {
  return res.render("login", { title: "login" });
};

export const registerGet = async (req = request, res = response) => {
  return res.render("register", { title: "register" });
};

export const registerPost = async (req = request, res = response) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) return res.redirect("/register");

  const user = await registerUser({ ...req.body });

  if (user) {
    const userName = `${user.name} ${user.lastName}`;
    req.session.user = userName;
    req.session.rol = user.rol;
    return res.redirect("/");
  }

  return res.redirect("/register");
};

export const LoginPost = async (req, res) => {
  const { email, password } = req.body;
  // Verificar si el email y la contraseña están presentes
  if (!email || !password) {
    return res.status(400).send("Faltan datos en la solicitud");
  }

  const user = await getUserEmail(email);

  console.log({ user });

  if (user && user.password === password) {
    const userName = `${user.name} ${user.lastName}`;
    req.session.user = userName;
    req.session.rol = user.rol;
    return res.redirect("/");
  }

  return res.redirect("/login");
};

export const Logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({ status: false, body: err });
    } else {
      return res.redirect("/login");
    }
  });
};
