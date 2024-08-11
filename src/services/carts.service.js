import { cartModel } from "../models/carts.js";

export const getCartProductsService = async (cid) => {
  try {
    return await cartModel.findById(cid).populate("products.id");
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

    const productoInCart = carrito.products.find(
      (p) => p.id.toString() === pid
    );

    if (productoInCart) {
      productoInCart.quantity++;
    } else {
      carrito.products.push({ id: pid, quantity: 1 });
    }

    carrito.save();

    return carrito;
  } catch (error) {
    console.log("addProductInCartService -> ", error);
    throw error;
  }
};

export const deleteProductsInCartService = async (
  req = request,
  res = response
) => {
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
    console.log("deleteProductsInCartService -> ", error);
    throw error;
  }
};

export const updateProductInCartService = async (req, res) => {
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
    console.log("updateProductInCartService -> ", error);
    throw error;
  }
};

export const deleteCartService = async (req = request, res = response) => {
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
    console.log("deleteCartService -> ", error);
    throw error;
  }
};
