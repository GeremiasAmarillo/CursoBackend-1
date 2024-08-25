import { UserDao } from "../daos/index.js";

export const getUserById = async (id) => await UserDao.getUserById();
export const getUserEmail = async (email) => await UserDao.getUserEmail();
export const registerUser = async (userData) => await UserDao.registerUser();
