import { Router } from "express";
import { getProductsServices } from "../services/products.service.js";
import { getCartProductsService } from "../services/carts.service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { payload } = await getProductsServices({});
    return res.render("home", { productos: payload, style: "style.css" });
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
  const result = await getProductsServices({ ...req.query });
  return res.render("products", { title: "productos", result });
});

router.get("/cart/:cid", async (req, res) => {
  const { cid } = req.params;
  console.log("id del carrito: ", cid);

  const carrito = await getCartProductsService(cid);
  return res.render("cart", { title: "carrito", carrito });
});

export default router;
