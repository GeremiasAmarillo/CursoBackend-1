import { cartModel } from "../models/carts.js";

export const getCartProductsService = async (cid) => {
  try {
    return await cartModel.findById(cid).populate("products.id").lean();
  } catch (error) {
    console.log("getCartProductsService -> ", error);
    throw error;
  }
};

export const newCartService = async () => {
  try {
    return await cartModel.create({});
  } catch (error) {
    console.log("newCartService -> ", error);
    throw error;
  }
};

export const addProductInCartService = async (cid, pid) => {
  try {
    const carrito = await cartModel.findById(cid);

    if (!carrito) {
      return null;
    }

    // Busca si el producto ya está en el carrito
    const productoInCart = carrito.products.find(
      (p) => p.id.toString() === pid
    );

    if (productoInCart) {
      // Si el producto ya está, incrementa la cantidad
      productoInCart.quantity++;
    } else {
      // Si el producto no está, lo agrega con cantidad 1
      carrito.products.push({ id: pid, quantity: 1 });
    }

    // Guarda los cambios en el carrito
    await carrito.save();

    return carrito;
  } catch (error) {
    console.log("addProductInCartService -> ", error);
    throw error;
  }
};

export const deleteProductsInCartService = async (cid, pid) => {
  try {
    return await cartModel.findByIdAndUpdate(
      cid,
      {
        $pull: { products: { id: pid } },
      },
      { new: true }
    );
  } catch (error) {
    console.log("deleteProductsInCartService -> ", error);
    throw error;
  }
};

export const updateProductInCartService = async (cid, pid, quantity) => {
  try {
    return await cartModel.findOneAndUpdate(
      { _id: cid, "products.id": pid },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );
  } catch (error) {
    console.log("updateProductInCartService -> ", error);
    throw error;
  }
};

export const deleteCartService = async (cid) => {
  try {
    const deletedCart = await cartModel.findByIdAndDelete(cid);
    return deletedCart;
  } catch (error) {
    console.log("deleteCartService -> ", error);
    throw error;
  }
};
