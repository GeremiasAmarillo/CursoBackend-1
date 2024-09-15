import CartRepository from '../repositories/cartRepository.js';
import CartDTO from '../dto/cart.dto.js';
import TicketRepository from '../repositories/ticketRepository.js';
import UserRepository from '../repositories/userRepository.js';
import { calculateTotal } from '../util/util.js';
import ProductRepository from '../repositories/productRepository.js';

class CartService {

    async createCart() {
        return await CartRepository.createCart();
    }

    async getCartById(cid) {
        const cart = await CartRepository.getCartById(cid);
        return new CartDTO(cart.products);
    }
    async getFullCartById(cid) {
        const cart = await CartRepository.getFullCartById(cid);
        return cart;
    }

    async addProductToCart(cid, pid) {
        try {
            const cart = await CartRepository.getCartById(cid);
            if (!cart) throw new Error("Carrito no encontrado.");
    
            const product = await ProductRepository.getProductById(pid);
            if (!product) throw new Error("Producto no encontrado.");
    
            const productIndex = cart.products.findIndex(p => p.productId._id.toString() === pid);
    
            if (productIndex > -1) {
                if (cart.products[productIndex].quantity + 1 > product.stock) {
                    throw new Error("Stock insuficiente para este producto.");
                }
                cart.products[productIndex].quantity += 1;
            } else {
                if (product.stock < 1) {
                    throw new Error("Stock insuficiente para este producto.");
                }
                cart.products.push({ productId: pid, quantity: 1 });
            }
            return await CartRepository.addProductToCart(cid, pid);
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            throw new Error("Error al agregar el producto al carrito.");
        }
    }

    async removeProductFromCart(cid, pid) {
        return await CartRepository.removeProductFromCart(cid, pid);
    }

    async updateCart(cid, products) {
        return await CartRepository.updateCart(cid, products);
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await CartRepository.updateProductQuantity(cid, pid, quantity);
    }

    async clearCart(cid) {
        return await CartRepository.clearCart(cid);
    }

    async purchase(cartId) {
        const cart = await CartRepository.getCartById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        const unavailableProducts = [];

        for (const item of cart.products) {
            const product = await ProductRepository.getProductById(item.productId);
            if (!product) continue;

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;

                await ProductRepository.updateProduct(item.productId, { stock: product.stock });
            } else {
                unavailableProducts.push(item.productId); 
            }
        }

        const cartUser = await UserRepository.getUserByCartId(cartId);
        if (!cartUser) throw new Error("Usuario no encontrado para este carrito");

        const totalAmount = calculateTotal(cart.products);

        const ticket = await TicketRepository.createTicket({
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: cartUser.email
        });

        cart.products = cart.products.filter(item => unavailableProducts.includes(item.productId));
        await CartRepository.updateCart(cartId, cart.products);

        return { ticket, unavailableProducts };
    }
}

export default new CartService;