import bcriptjs from "bcrypt";

export const createHash = (password) => {
  const salt = bcriptjs.genSaltSync(10);
  const passHash = bcriptjs.hashSync(password, salt);

  return passHash;
};

export const isValidPassword = (password, userPassword) => {
  const passValid = bcriptjs.compareSync(password, userPassword);

  return passValid;
};
