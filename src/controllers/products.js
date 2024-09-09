import { request, response } from "express";
import { ProductRepository } from "../repositories/index.js";

export const getProducts = async (req = request, res = response) => {
  try {
    const result = await ProductRepository.getProducts(req.query);
    return res.json({ result });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Hablar con un administrador", error: error.message });
  }
};

export const getProductsById = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const producto = await ProductRepository.getProductsById(pid);
    if (!producto)
      return res
        .status(404)
        .json({ msg: `El producto con id ${pid} no existe` });
    return res.json({ producto });
  } catch (error) {
    console.log("getProductsById -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const addProduct = async (req = request, res = response) => {
  try {
    const { title, description, price, code, stock, category } = req.body;

    const producto = await ProductRepository.addProduct({ ...req.body });
    return res.json({ producto });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const updateProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const { _id, ...rest } = req.body;

    const producto = await ProductRepository.updateProduct(pid, rest);
    if (producto) return res.json({ msg: "Producto actualizado", producto });
    return res
      .status(404)
      .json({ msg: `No se pudo actualizar el producto con id ${pid}` });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const deleteProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      return res.status(400).json({ msg: 'El parámetro "pid" es requerido' });
    }

    const producto = await ProductRepository.deleteProduct(pid);
    if (producto) {
      return res.json({ msg: "Producto eliminado", producto });
    } else {
      return res
        .status(404)
        .json({ msg: `No se pudo encontrar el producto con id ${pid}` });
    }
  } catch (error) {
    console.log("deleteProduct -> ", error);
    return res
      .status(500)
      .json({ msg: "Hablar con un administrador", error: error.message });
  }
};
