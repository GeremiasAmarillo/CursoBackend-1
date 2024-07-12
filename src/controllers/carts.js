import { request, response } from "express";
import { cartModel } from "../models/carts.js";

export const getCartProducts = async (req = request, res = response) => {
  try {
    const { cid } = req.params;
    const carrito = await cartModel.findById(cid);

    if (carrito) return res.json({ carrito });

    return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });
  } catch (error) {
    console.log("getCartProducts -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const newCart = async (req = request, res = response) => {
  try {
    const carrito = await cartModel.create({});
    return res.json({ msg: "Carrito creado", carrito });
  } catch (error) {
    console.log("newCart -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const addProductToCart = async (req = request, res = response) => {
  try {
    const { cid, pid } = req.params;
    const carrito = await cartModel.findById(cid);

    if (!carrito)
      return res
        .status(404)
        .json({ msg: `El carrito con id ${cid} no existe!` });

    const productoInCart = carrito.products.find(
      (p) => p.id.toString() === pid
    );

    if (productoInCart) productoInCart.quantity++;
    else carrito.products.push({ id: pid, quantity: 1 });

    carrito.save();

    return res.json({ msg: "Carrito actualizado" });
  } catch (error) {
    console.log("addProductToCart -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};
