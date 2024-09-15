import { Router } from "express";
import CartController from "../controllers/carts.controller.js";


const router = Router();

router.post("/", CartController.createCart);
router.get("/:cid", CartController.getFullCartById);
router.post('/:cid/products/:pid', CartController.addProductToCart);
router.delete('/:cid/products/:pid', CartController.removeProductFromCart);
router.put('/:cid',  CartController.updateCart);
router.put('/:cid/products/:pid', CartController.updateProductQuantity);
router.delete('/:cid', CartController.clearCart);
router.get("/:cid/purchase", CartController.purchase);

export default router;
