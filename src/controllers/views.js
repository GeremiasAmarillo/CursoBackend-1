import { request, response } from "express";
import { CartRepository, ProductRepository } from "../repositories/index.js";

export const homeView = async (req = request, res = response) => {
  const limit = 50;
  const { payload } = await ProductRepository.getProducts({ limit });

  const user = req.session.user;

  return res.render("home", {
    productos: payload,
    styles: "style.css",
    user,
  });
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

  const result = await ProductRepository.getProducts({ ...req.query });
  return res.render("products", { title: "productos", result, user });
};

export const cartView = async (req = request, res = response) => {
  const user = req.session.user;

  const { cid } = req.params;
  const carrito = await CartRepository.getCartById(cid);
  return res.render("cart", { title: "carrito", carrito, user });
};

export const loginGet = async (req = request, res = response) => {
  if (req.session.user) return res.redirect("/");

  return res.render("login", { title: "login" });
};

export const registerGet = async (req = request, res = response) => {
  if (req.session.user) return res.redirect("/");

  return res.render("register", { title: "register" });
};

export const registerPost = async (req = request, res = response) => {
  if (!req.user) {
    return res.redirect("/register");
  }
  return res.redirect("/login");
};

export const Login = async (req = request, res = response) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  req.session.user = {
    name: req.user.name,
    lastName: req.user.lastName,
    email: req.user.email,
    rol: req.user.rol,
    avatar: req.user.avatar,
  };

  return res.redirect("/");
};

export const Logout = async (req = request, res = response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({ status: false, body: err });
    } else {
      return res.redirect("/login");
    }
  });
};
