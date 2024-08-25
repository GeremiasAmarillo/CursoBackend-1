import { request, response } from "express";
/*
import {
  addProductInCartService,
  deleteCartService,
  deleteProductsInCartService,
  getCartProductsService,
  newCartService,
  updateProductInCartService,
} from "../services/carts.service.js"; */
import { CartRepository } from "../repositories/index.js";

export const getCartProducts = async (req = request, res = response) => {
  try {
    const { cid } = req.params;
    const carrito = await CartRepository.getCartById(cid);

    if (carrito) {
      return res.json({ carrito });
    }

    return res.status(500).json({ msg: `El carrito con id ${cid} no existe` });
  } catch (error) {
    console.log("getCartProducts -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const newCart = async (req = request, res = response) => {
  try {
    const carrito = await CartRepository.newCart();
    return res.json({ msg: "Carrito creado", carrito });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const addProductInCart = async (req = request, res = response) => {
  try {
    const { cid, pid } = req.params;
    const carrito = await CartRepository.addProductInCart(cid, pid);

    if (!carrito) {
      return res
        .status(404)
        .json({ msg: `El carrito con id ${cid} no existe!` });
    }
    return res.json({ msg: "Carrito actualizado" });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const deleteProductsInCart = async (req = request, res = response) => {
  try {
    const { cid, pid } = req.params;
    const carrito = await CartRepository.deleteProductsInCart(cid, pid);

    if (!carrito) {
      return res.status(404).json({ msg: "No se pudo hacer la operacion" });
    }

    return res.json({
      msg: `Producto con id ${pid} eliminado del carrito ( id del carrito : ${cid})`,
      carrito,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const updateProductInCart = async (req = request, res = response) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || !Number.isInteger(quantity))
      return res.status(404).json({
        msg: "La propiedad queantity es obligatoriay debe obtener un numero entero",
      });

    const carrito = await CartRepository.updateProductInCart(
      cid,
      pid,
      quantity
    );

    if (!carrito) {
      return res.status(404).json({ msg: "No se pudo actualizar el carrito" });
    }
    return res.json({ msg: "Producto actualizado en el carrito", carrito });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const deleteCart = async (req = request, res = response) => {
  try {
    const { cid } = req.params;
    const deletedCart = await CartRepository.deleteCart(cid);

    if (!deletedCart) {
      return res
        .status(404)
        .json({ msg: `El carrito con id ${cid} no existe` });
    }

    return res.json({ msg: `Carrito con id ${cid} eliminado correctamente` });
  } catch (error) {
    console.log("deleteCart -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};
