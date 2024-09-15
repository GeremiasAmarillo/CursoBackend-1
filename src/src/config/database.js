import mongoose from "mongoose";

import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("Variable de entorno MONGO_URI no configurada! Por favor, verifique el archivo .env");
    }
   
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error de conexión con MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;