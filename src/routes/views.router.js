import { Router } from "express";
import { productModel } from "../models/products.js";
import { getCartProducts } from "../controllers/carts.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const productos = await productModel.find().lean();
    return res.render("home", { productos, style: "style.css" });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).send("Error al obtener los productos");
  }
});

router.get("/realTimeProducts", (req, res) => {
  return res.render("realTimeProducts");
});

router.get("/chat", (req, res) => {
  return res.render("chat");
});

router.get("/products", async (req, res) => {
  try {
    const result = await productModel.find({ ...req.query }).lean();
    return res.render("products", {
      title: "Productos",
      result: { payload: result },
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).send("Error al obtener los productos");
  }
});

router.get("/cart/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cartProducts = await getCartProducts(cartId);
    res.render("cart", { products: cartProducts });
  } catch (error) {
    console.error("Error al obtener productos del carrito:", error);
    res.status(500).send("Error al obtener productos del carrito");
  }
});

export default router;
