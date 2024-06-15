import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

export class CartManager {
  constructor() {
    this.path = "src/model.database/cart.json";
    this.carts = [];
  }

  getCarts = async () => {
    try {
      const response = await fs.readFile(this.path, "utf8");
      const responseJSON = JSON.parse(response);
      return responseJSON;
    } catch (error) {
      console.error("Error al leer el carrito:", error);
      return [];
    }
  };

  getCartProducts = async (id) => {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === id);

    if (cart) {
      return cart.products;
    } else {
      console.log("Carrito no encontrado");
      return [];
    }
  };

  newCart = async () => {
    const id = uuidv4();

    const newCart = { id, products: [] };

    this.carts = await this.getCarts();
    this.carts.push(newCart);

    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    return newCart;
  };

  addProductToCart = async (cart_id, product_id) => {
    try {
      const carts = await this.getCarts();
      const index = carts.findIndex((cart) => cart.id === cart_id);
      if (index !== -1) {
        const cartProducts = await this.getCartProducts(cart_id);
        const existingProductIndex = cartProducts.findIndex(
          (product) => product.product_id === product_id
        );

        if (existingProductIndex !== -1) {
          cartProducts[existingProductIndex].quantity += 1;
        } else {
          cartProducts.push({ product_id, quantity: 1 });
        }

        carts[index].products = cartProducts;

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        console.log("Producto agregado con éxito");
      } else {
        console.log("Carrito no encontrado");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };
}
