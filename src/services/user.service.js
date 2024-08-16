import { userModel } from "../models/user.js";

export const getUserById = async (id) => {
  try {
    return await userModel.findById(id);
  } catch (error) {
    console.log("getUserById -> ", error);
    throw error;
  }
};

export const getUserEmail = async (email) => {
  try {
    return await userModel.findOne({ email });
  } catch (error) {
    console.log("getUserEmail -> ", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const user = new userModel(userData);
    await user.save();
    return user;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};
