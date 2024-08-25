import { userModel } from "./models/user.models.js";

export const getUserById = async (id) => {
  return await userModel.findById(id);
};

export const getUserEmail = async (email) => {
  return await userModel.findOne({ email });
};

export const registerUser = async (userData) => {
  return await userModel.create({ ...user });
};
