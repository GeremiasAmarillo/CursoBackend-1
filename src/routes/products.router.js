import { Router } from "express";
import { productManager } from "../server.js";

const productsRouter = Router();

// /= http://localhost:8080/products
productsRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      return res.json(limitedProducts);
    }

    return res.json(products);
  } catch (error) {
    console.log(error);
    res.send("Error al intentar recibir los productos");
  }
});

productsRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const products = await productManager.getProductsById(pid);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.send(`Error al recibir el producto con id ${pid}`);
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status = true,
      category,
    } = req.body;

    const response = await productManager.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.send("Error al agregar producto");
  }
});

productsRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status = true,
      category,
    } = req.body;
    const response = await productManager.updateProduct(pid, {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.send(`Error al editar el producto con id ${pid}`);
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    await productManager.deleteProduct(pid);
    res.send("Producto eliminado correctamente");
  } catch (error) {
    console.log(error);
    res.send(`Error al eliminar el producto con id ${pid}`);
  }
});

export { productsRouter };
