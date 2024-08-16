import { Router } from "express";
import {
  cartView,
  chatView,
  homeView,
  Login,
  loginGet,
  Logout,
  productView,
  realTimeProductsView,
  registerGet,
  registerPost,
} from "../controllers/views.js";
import { admin, auth } from "../middleware/auth.js";
import passport from "passport";

const router = Router();

router.get("/", homeView);

router.get("/realTimeProducts", auth, realTimeProductsView);

router.get("/chat", auth, chatView);

router.get("/products", auth, productView);

router.get("/cart/:cid", auth, cartView);

router.get("/login", loginGet);

router.get("/register", registerGet);

router.get("/logout", Logout);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  registerPost
);
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  Login
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/login-github-callback",
  passport.authenticate("github", { failureRedirect: "/register" }),
  Login
);

export default router;
