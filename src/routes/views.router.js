import { Router } from "express";
import { ProductManager } from "../model.manager/productManager.js";

const router = Router();
router.get("/", async (req, res) => {
  const p = new ProductManager();
  try {
    const productos = await p.getProducts();
    return res.render("home", { productos, style: "style.css" });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).send("Error al obtener los productos");
  }
});
router.get("/realTimeProducts", (req, res) => {
  return res.render("realTimeProducts");
});
export default router;
