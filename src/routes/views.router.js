import { Router } from "express";
import { productModel } from "../models/products.js";

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
export default router;
