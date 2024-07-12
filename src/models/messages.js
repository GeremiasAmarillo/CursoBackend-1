import { Schema, model } from "mongoose";

const nameCollection = "Message";

const MessageSchema = new Schema({
  user: {
    type: String,
    required: [true, "El nombre del ususario es obligatorio"],
  },
  message: {
    type: String,
    required: [true, "El mensaje es obligatorio"],
  },
});

export const MessageModel = model(nameCollection, MessageSchema);
