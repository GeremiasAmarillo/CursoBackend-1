import CartService from '../services/carts.service.js';

class CartController {

    async createCart(req, res) {
        try {
            const newCart = await CartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            console.error("Error al crear carrito:", error);
            res.status(500).json({ error: error.message });
        }
    }
    async getCartById(req, res) {
        try {
            const cart = await CartService.getCartById(req.params.cid);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(cart);
        } catch (error) {
            console.error("Error al obtener carrito por ID:", error);
            res.status(500).json({ error: error.message });
        }
    }    

    async getFullCartById(req, res) {
        try {
            const cart = await CartService.getFullCartById(req.params.cid);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(cart);
        } catch (error) {
            console.error("Error al obtener carrito por ID:", error);
            res.status(500).json({ error: error.message });
        }
    }    

    async addProductToCart(req, res) {
        try {
            const updatedCart = await CartService.addProductToCart(req.params.cid, req.params.pid);
            res.json(updatedCart);
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const updatedCart = await CartService.removeProductFromCart(req.params.cid, req.params.pid);
            res.json(updatedCart);
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateCart(req, res) {
        try {
            const updatedCart = await CartService.updateCart(req.params.cid, req.body.products);
            res.json(updatedCart);
        } catch (error) {
            console.error("Error al actualizar carrito:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateProductQuantity(req, res) {
        const { quantity } = req.body;
        try {
            const updatedCart = await CartService.updateProductQuantity(req.params.cid, req.params.pid, quantity);
            res.json(updatedCart);
        } catch (error) {
            console.error("Error al actualizar la cantidad de productos en el carrito:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async clearCart(req, res) {
        try {
            const updatedCart = await CartService.clearCart(req.params.cid);
            res.json(updatedCart);
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
            res.status(500).json({ error: error.message });
        }
    }
    async purchase(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await CartService.getCartById(cartId);
            if (!cart || cart.products.length === 0) {
                return res.status(400).json({ message: "El carrito está vacío. No se puede finalizar la compra." });
            }
            
            const { ticket, unavailableProducts } = await CartService.purchase(cartId);

            res.json({
                message: "Compra generada",
                ticket: {
                    id: ticket._id,
                    amount: ticket.amount,
                    purchaser: ticket.purchaser
                },
                unavailableProducts
            });

        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    };

}

export default new CartController;
