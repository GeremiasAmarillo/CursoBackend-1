import {
  CartRepository,
  ProductRepository,
  UserRepository,
} from "../repositories/index.js";
import { request, response } from "express";
import { cartModel } from "../daos/mongo/models/carts.models.js"; // Verifica la ruta
import { productModel } from "../daos/mongo/models/products.models.js"; // Verifica la ruta
import { ticketModel } from "../daos/mongo/models/ticket.model.js"; // Verifica la ruta

// Generador de códigos únicos
const generateUniqueCode = () => Math.random().toString(36).substr(2, 9);

export const getCartProducts = async (req = request, res = response) => {
  try {
    const { _id } = req;
    const { cid } = req.params;

    const usuario = await UserRepository.getUserById(_id);

    if (!usuario) {
      return res.status(400).json({ ok: false, msg: "El usuario no existe" });
    }

    if (usuario.cart_id.toString() !== cid) {
      return res.status(400).json({ ok: false, msg: "Carrito no válido" });
    }

    const carrito = await CartRepository.getCartById(cid);

    if (carrito) {
      return res.json({ carrito });
    } else {
      return res.status(404).json({ msg: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error("getCartProducts -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const completePurchase = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel.findById(cartId).populate("products.id");

    if (!cart) {
      return res.status(404).json({ msg: "Carrito no encontrado" });
    }

    const purchasedProducts = [];
    const failedProducts = [];

    let totalAmount = 0;

    for (const item of cart.products) {
      const product = await productModel.findById(item.id);

      if (!product) {
        failedProducts.push(item.id);
        continue;
      }

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        purchasedProducts.push(item);
        totalAmount += item.quantity * product.price; // Usa product.price
      } else {
        failedProducts.push(item.id);
      }
    }

    const ticket = await ticketModel.create({
      code: generateUniqueCode(), // Implementa una función para generar un código único
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: req.user.email, // Accede al email desde req.user
    });

    if (failedProducts.length > 0) {
      cart.products = cart.products.filter((item) =>
        failedProducts.includes(item.id)
      );
      await cart.save();
    } else {
      // Usa deleteOne en lugar de remove
      await cart.deleteOne();
    }

    res.status(200).json({ ticket, failedProducts });
  } catch (error) {
    console.error("Error al completar la compra:", error);
    res.status(500).json({ msg: "Error al completar la compra", error });
  }
};

export const addProductInCart = async (req = request, res = response) => {
  try {
    const { _id } = req; // ID del usuario (asegúrate de que _id esté definido correctamente)
    const { cid, pid } = req.params; // ID del carrito y producto

    // Buscar el carrito por ID
    const cart = await cartModel.findById(cid); // Usa cartModel
    if (!cart) {
      return res.status(404).json({ ok: false, msg: "Carrito no válido" });
    }

    // Buscar el producto por ID
    const product = await productModel.findById(pid); // Usa productModel
    if (!product) {
      return res.status(404).json({ ok: false, msg: "Producto no válido" });
    }

    // Agregar el producto al carrito
    const existingProduct = cart.products.find((p) => p.id.toString() === pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ id: pid, quantity: 1 });
    }
    await cart.save();

    return res.json({ msg: "Producto agregado al carrito", cart });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const deleteProductsInCart = async (req = request, res = response) => {
  try {
    const { _id } = req;
    const { cid, pid } = req.params;

    const usuario = await UserRepository.getUserById(_id);

    if (!usuario) {
      return res.status(400).json({ ok: false, msg: "El usuario no existe" });
    }

    if (usuario.cart_id.toString() !== cid) {
      return res.status(400).json({ ok: false, msg: "Carrito no válido" });
    }

    const existeProducto = await ProductRepository.getProductsById(pid);

    if (!existeProducto) {
      return res.status(400).json({ ok: false, msg: "El producto no existe" });
    }

    const carrito = await CartRepository.deleteProductsInCart(cid, pid);

    return res.json({
      msg: `Producto con id ${pid} eliminado del carrito (id del carrito: ${cid})`,
      carrito,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const updateProductInCart = async (req = request, res = response) => {
  try {
    const { _id } = req;
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || !Number.isInteger(quantity))
      return res.status(400).json({
        msg: "La propiedad quantity es obligatoria y debe ser un número entero",
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
    console.error("deleteCart -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};
