import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";
import extractUserFromToken, { onlyAdmin, onlyUser } from "../middleware/auth.js";
import passport from "passport";
import userRepository from "../repositories/userRepository.js";

const router = Router();
router.use(extractUserFromToken);

router.get("/", passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), onlyUser, async (req, res) => {
    try {    
        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await ProductManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        const arrayProducts = products.docs.map(product => {
            return product._doc;
        });

        const user = await userRepository.getUserByUsername(res.locals.username);
        const cart = await userRepository.getCartByUserId(user._id);

        res.render(
            'home',
            {
                cart: cart._id,
                products: arrayProducts,
                totalPages: products.totalPages,
                prevPage: products.prevPage || 1,
                nextPage: products.nextPage || null,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null
            }
        );

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const product = await ProductManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).render("404", { message: "Producto no encontrado" });
        }
        res.render("productDetail", { product });
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).send("Error fetching product details");
    }
});

router.get('/realtimeproducts', passport.authenticate("jwt", { session: false }), onlyAdmin, async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    try {
        const products = await ProductManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        const arrayProducts = products.docs.map(product => {
            return product._doc;
        });

        res.render(
            'realTimeProducts',
            {
                products: arrayProducts,
                totalPages: products.totalPages,
                prevPage: products.prevPage || 1,
                nextPage: products.nextPage || null,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null
            }
        );

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).render("404", { message: "Carrito no encontrado" });
        }
        const plainCart = cart.toObject();
        res.render(
            'cartDetail',
            {
                cart: plainCart,
            }
        );
    } catch (error) {
        console.error("Error al obtener detalles del carrito: ", error);
        res.status(500).send("Error al obtener detalles del carrito");
    }
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

export default router;
