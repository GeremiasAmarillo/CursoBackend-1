import { Schema, model } from "mongoose";

const nameCollection = "Producto";

const ProductoSchema = new Schema({
  title: {
    type: String,
    required: [true, "El titulo del prodcuto es obligatorio"],
  },
  description: {
    type: String,
    required: [true, "La descripcion del prodcuto es obligatorio"],
  },
  price: {
    type: Number,
    required: [true, "El precio del prodcuto es obligatorio"],
  },
  thumbnail: [{ type: String }],
  code: {
    type: String,
    required: [true, "El codigo del prodcuto es obligatorio"],
    unique: true,
  },
  stock: {
    type: Number,
    required: [true, "El stock del prodcuto es obligatorio"],
  },
  status: { type: Boolean, default: true },
  category: {
    type: String,
    required: [true, "La categoria del prodcuto es obligatorio"],
  },
});

ProductoSchema.set("toJSON", {
  transform: function (doc, ret) {
    return ret;
  },
});

export const productModel = model(nameCollection, ProductoSchema);
