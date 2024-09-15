import Cart from '../models/cart.model.js';

class CartManager {
    async createCart() {
        try {
            const cart = new Cart();
            return await cart.save();
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw new Error("Error al crear el carrito");
        }
    }

    async getCartById(id) {
        try {
            return await Cart.findById(id).populate('products.product');
        } catch (error) {
            console.error("Error al obtener el carrito por ID:", error);
            throw new Error("Error al obtener el carrito por ID");
        }
    }


    async addProductToCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado");

            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

            if (productIndex > -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }

            return await cart.save();
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw new Error("Error al agregar producto al carrito");
        }
    }
    async removeProductFromCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado");

            cart.products = cart.products.filter(p => p.product.toString() !== pid);
            return await cart.save();
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            throw new Error("Error al eliminar producto del carrito");
        }
    }

    async updateCart(cid, products) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado");

            cart.products = products;
            return await cart.save();
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw new Error("Error al actualizar el carrito");
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado");

            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

            if (productIndex > -1) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }

            return await cart.save();
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw new Error("Error al actualizar la cantidad del producto en el carrito");
        }
    }

    async clearCart(cid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado");

            cart.products = [];
            return await cart.save();
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            throw new Error("Error al vaciar el carrito");
        }
    }
}

export default new CartManager;
