import { ProductRepository, UserRepository } from "../repositories/index.js";

export const existeEmail = async (email) => {
  const emailExiste = await UserRepository.getUserEmail(email);

  if (emailExiste) {
    throw new Error(`El email ${email} ya esta registrado`);
  }
};

export const existeCode = async (code) => {
  const codeExiste = await ProductRepository.getProductsById(code);

  if (codeExiste) {
    throw new Error(`El code ${code} ya esta registrado en otro producto`);
  }
};
