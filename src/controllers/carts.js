import { request, response } from "express";
import { cartModel } from "../models/carts.js";

export const getCartProducts = async (req = request, res = response) => {
  try {
    const { cid } = req.params;
    const carrito = await cartModel
      .findById(cid)
      .populate("products.id", "-__v");

    if (!carrito) {
      return res
        .status(404)
        .json({ msg: `El carrito con id ${cid} no existe` });
    }

    return res.json({ carrito });
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

    if (!carrito) {
      return res
        .status(404)
        .json({ msg: `El carrito con id ${cid} no existe!` });
    }

    const productoInCart = carrito.products.find(
      (p) => p.id.toString() === pid
    );

    if (productoInCart) {
      productoInCart.quantity++;
    } else {
      carrito.products.push({ id: pid, quantity: 1 });
    }

    await carrito.save();

    return res.json({ msg: "Carrito actualizado" });
  } catch (error) {
    console.log("addProductToCart -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const deleteProductsInCart = async (req = request, res = response) => {
  try {
    const { cid, pid } = req.params;
    const carrito = await cartModel.findByIdAndUpdate(
      cid,
      { $pull: { products: { id: pid } } },
      { new: true }
    );

    if (!carrito) {
      return res
        .status(404)
        .json({ msg: `El carrito con id ${cid} no existe` });
    }

    return res.json({ msg: `Producto con id ${pid} eliminado del carrito` });
  } catch (error) {
    console.log("deleteProductsInCart -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const updateProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    let { quantity } = req.body;

    quantity = parseInt(quantity);

    if (isNaN(quantity) || quantity <= 0) {
      return res
        .status(400)
        .json({ msg: "La cantidad debe ser un número positivo" });
    }

    const carrito = await cartModel.findById(cid);
    if (!carrito) {
      return res
        .status(404)
        .json({ msg: `El carrito con id ${cid} no existe` });
    }

    const productoInCart = carrito.products.find(
      (p) => p.id.toString() === pid
    );
    if (!productoInCart) {
      return res
        .status(404)
        .json({ msg: `El producto con id ${pid} no está en el carrito` });
    }

    productoInCart.quantity = quantity;
    await carrito.save();

    return res.json({
      msg: `Producto con id ${pid} actualizado en el carrito`,
    });
  } catch (error) {
    console.log("updateProductInCart -> ", error);
    return res
      .status(500)
      .json({ msg: "Error al actualizar el producto en el carrito" });
  }
};

export const deleteCart = async (req = request, res = response) => {
  try {
    const { cid } = req.params;
    const deletedCart = await cartModel.findByIdAndDelete(cid);

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
