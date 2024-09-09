import { CartDao } from "../daos/index.js ";

export const getCartById = async (cid) => await CartDao.getCartById(cid);
export const newCart = async () => await CartDao.newCart();
export const addProductInCart = async (cid, pid) =>
  await CartDao.addProductInCart(cid, pid);
export const deleteProductsInCart = async (cid, pid) =>
  await CartDao.deleteProductsInCart(cid, pid);
export const updateProductInCart = async (cid, pid, quantity) =>
  await CartDao.updateProductInCart(cid, pid, quantity);
export const deleteCart = async (cid) => await CartDao.deleteCart(cid);
