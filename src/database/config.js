import mongoose from "mongoose";

export const dbconnection = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGO_DB);
    console.log("Base de datos online");
  } catch (error) {
    console.log(`Error al levantar base de datos ${error}`);
    process.exit(1);
  }
};
