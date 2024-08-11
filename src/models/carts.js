import { Schema, model } from "mongoose";

const nameCollection = "Cart";

const CartSchema = new Schema({
  products: [
    {
      id: {
        _id: false,
        type: Schema.Types.ObjectId,
        ref: "Producto",
      },
      quantity: {
        type: Number,
        required: [true, "La cantidad del producto es obligatorio"],
      },
    },
  ],
});

CartSchema.set("toJSON", {
  transform: function (doc, ret) {
    // Renombramos el _id del carrito a cartId
    ret.cartId = ret._id;
    delete ret._id;
    delete ret.__v;

    // Transformamos la información de los productos para incluir más detalles
    ret.products = ret.products.map((product) => {
      const { id, quantity } = product;
      return {
        productId: id._id,
        name: id.name,
        description: id.description,
        price_per_unit: id.price,
        quantity,
        totalPrice: quantity * id.price, // Calculamos el precio total
      };
    });

    return ret;
  },
});

export const cartModel = model(nameCollection, CartSchema);
