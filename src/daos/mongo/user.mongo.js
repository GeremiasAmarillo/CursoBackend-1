import { userModel } from "./models/user.models.js";

export const getUserById = async (id) => {
  return await userModel.findById({ _id: id });
};

export const getUserEmail = async (email) => {
  return await userModel.findOne({ email });
};

export const registerUser = async (user) => {
  return await userModel.create({ ...user });
};
