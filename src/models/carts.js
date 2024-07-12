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
    return ret;
  },
});

export const cartModel = model(nameCollection, CartSchema);
