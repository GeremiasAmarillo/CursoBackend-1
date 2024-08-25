import { CartDao } from "../daos/index.js ";

export const getCartById = async () => await CartDao.getCartById();
export const newCart = async () => await CartDao.newCart();
export const addProductInCart = async () => await CartDao.addProductInCart();
export const deleteProductsInCart = async () =>
  await CartDao.deleteProductsInCart();
export const updateProductInCart = async () =>
  await CartDao.updateProductInCart();
export const deleteCart = async () => await CartDao.deleteCart();
