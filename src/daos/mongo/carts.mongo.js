import { cartModel } from "./models/carts.models.js";

export const getCartById = async (cid) => {
  return await cartModel.findById(cid).populate("products.id").lean();
};

export const newCart = async () => {
  return await cartModel.create({});
};

export const addProductInCart = async (cid, pid) => {
  const carrito = await cartModel.findById(cid);

  if (!carrito) {
    return null;
  }

  const productoInCart = carrito.products.find((p) => p.id.toString() === pid);

  if (productoInCart) {
    productoInCart.quantity++;
  } else {
    carrito.products.push({ id: pid, quantity: 1 });
  }

  await carrito.save();

  return carrito;
};

export const deleteProductsInCart = async (cid, pid) => {
  return await cartModel.findByIdAndUpdate(
    cid,
    {
      $pull: { products: { id: pid } },
    },
    { new: true }
  );
};

export const updateProductInCart = async (cid, pid, quantity) => {
  return await cartModel.findOneAndUpdate(
    { _id: cid, "products.id": pid },
    { $set: { "products.$.quantity": quantity } },
    { new: true }
  );
};

export const deleteCart = async (cid) => {
  const deletedCart = await cartModel.findByIdAndDelete(cid);
  return deletedCart;
};
