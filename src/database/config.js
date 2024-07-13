import mongoose from "mongoose";

export const dbconnection = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGO_DB, {
      dbName: process.env.NAME_DB,
    });
    console.log(
      `Conexión a MongoDB establecida en ${process.env.URI_MONGO_DB}`
    );
    console.log(`Base de datos ${process.env.NAME_DB} online`);
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};
