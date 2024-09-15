import jwt from "jsonwebtoken";

const extractUserFromToken = (req, res, next) => {
    const token = req.cookies.coderCookieToken;

    if (token) {
        try {
            const decoded = jwt.verify(token, "extremelydifficulttorevealsecret");
            res.locals.username = decoded.username;
            res.locals.role = decoded.role;
            res.locals.cart = decoded.cart;
        } catch (error) {
            console.error("Error al decodificar el token:", error);
        }
    }

    next();
};

export function onlyAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).render("onlyAdmin", {
            layout: false,
            message: "Acceso denegado. Esta área es solo para administradores."
        });
    }
}

export function onlyUser(req, res, next) {
    if (req.user && req.user.role === "user") {
        next();
    } else if(req.user && req.user.role === "admin") {
        res.status(403).render("onlyUser", {
            layout: false,
            message: "Acceso denegado. Esta área es solo para usuarios."
        });
    }
    else {
        res.render("login");
    }
}

export default extractUserFromToken;
