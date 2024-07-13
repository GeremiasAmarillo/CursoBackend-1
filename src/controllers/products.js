import { request, response } from "express";
import { productModel } from "../models/products.js";

export const getProducts = async (req = request, res = response) => {
  try {
    let { limit = 2, page = 1, sort, query } = req.query;
    page = page == 0 ? 1 : page;
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;
    const sortOrderOptions = {
      asc: -1,
      desc: 1,
    };
    sort = sortOrderOptions[sort] || null;

    try {
      if (query) {
        query = JSON.parse(decodeURIComponent(query));
      }
    } catch (error) {
      console.log("Error al parsear:", error);
      query = {};
    }

    const queryProducts = productModel.find(query).limit(limit).skip(skip);
    if (sort !== null) {
      queryProducts.sort({ price: sort });
    }
    const [productos, totalDocs] = await Promise.all([
      queryProducts,
      productModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;

    const result = {
      totalDocs,
      totalPages,
      limit,
      query,
      hasNextPage,
      hasPrevPage,
      prevPage,
      nextPage,
      payload: productos,
      prevLink: hasPrevPage
        ? `/api/products?limit=${limit}&page=${prevPage}`
        : null,
      nextLink: hasNextPage
        ? `/api/products?limit=${limit}&page=${nextPage}`
        : null,
    };

    return res.json({ result });
  } catch (error) {
    console.log("getProducts -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const getProductsById = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const producto = await productModel.findById(pid);
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
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category)
      return res.status(404).json({
        msg: "Los campos [title,description,code,price,stock,category] son obligatorios",
      });

    const producto = await productModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });

    return res.json({ producto });
  } catch (error) {
    console.log("addProduct -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const updateProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const { _id, ...rest } = req.body;

    const producto = await productModel.findByIdAndUpdate(
      pid,
      { ...rest },
      { new: true }
    );
    if (producto) return res.json({ msg: "Producto actualizado", producto });
    return res
      .status(404)
      .json({ msg: `No se pudo actualizar el producto con id ${pid}` });
  } catch (error) {
    console.log("updateProduct -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const deleteProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const producto = await productModel.findByIdAndDelete(pid);
    if (producto) return res.json({ msg: "Producto eliminado", producto });
    return res
      .status(404)
      .json({ msg: `No se pudo eliminar el producto con id ${pid}` });
  } catch (error) {
    console.log("deleteProduct -> ", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};
