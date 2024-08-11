import { Router } from "express";
import { getCartProducts } from "../controllers/carts.js";
import { getProductsServices } from "../services/products.service.js";

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

export default router;
