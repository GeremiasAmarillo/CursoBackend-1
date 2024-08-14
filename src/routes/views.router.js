import { Router } from "express";
import {
  cartView,
  chatView,
  homeView,
  loginGet,
  LoginPost,
  Logout,
  productView,
  realTimeProductsView,
  registerGet,
  registerPost,
} from "../controllers/views.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", homeView);

router.get("/realTimeProducts", auth, realTimeProductsView);

router.get("/chat", auth, chatView);

router.get("/products", auth, productView);

router.get("/cart/:cid", auth, cartView);

router.get("/login", loginGet);
router.post("/login", LoginPost);

router.get("/register", registerGet);
router.post("/register", registerPost);

router.get("/logout", Logout);

export default router;
