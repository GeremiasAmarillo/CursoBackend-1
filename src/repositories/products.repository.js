import { ProductDao } from "../daos/index.js";

export const getProducts = async (query) => await ProductDao.getProducts(query);
export const getProductsById = async (pid) =>
  await ProductDao.getProductsById(pid);
export const addProduct = async (body) => await ProductDao.addProduct(body);
export const updateProduct = async (pid, rest) =>
  await ProductDao.updateProduct(pid, rest);
export const deleteProduct = async (pid) => await ProductDao.deleteProduct(pid);
