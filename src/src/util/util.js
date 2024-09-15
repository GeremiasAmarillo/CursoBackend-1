import bcrypt from "bcrypt";

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

const calculateTotal = (products) => {
    let total = 0;
    products.forEach(product => {
      total += product.productId.price * product.quantity;
    });
  
    return total;
}

export { calculateTotal, createHash, isValidPassword };
