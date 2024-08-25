import { Schema, model } from "mongoose";

const nameCollection = "user";

const UserSchema = new Schema({
  name: { type: String, required: [true, "El nombre es obligatorio"] },
  lastName: { type: String },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: { type: String, required: [true, "La contraseña es obligatoria"] },
  rol: { type: String, default: "user", enum: ["user", "admin"] },
  status: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now },
  avatar: { type: String },
  github: { type: Boolean, default: false },
  google: { type: Boolean, default: false },
  facebook: { type: Boolean, default: false },
});
UserSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const userModel = model(nameCollection, UserSchema);
