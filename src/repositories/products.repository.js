import { ProductDao } from "../daos/index.js";

export const getProducts = async () => await ProductDao.getProducts();
export const getProductsById = async () => await ProductDao.getProductsById();
export const addProduct = async () => await ProductDao.addProduct();
export const updateProduct = async () => await ProductDao.updateProduct();
export const deleteProduct = async () => await ProductDao.deleteProduct();
