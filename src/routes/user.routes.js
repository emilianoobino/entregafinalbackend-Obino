import express from "express";
import passport from "passport";

import UserController from "../controllers/user.controller.js";
const userController = new UserController;
import checkUserRole from "../middlewares/rolecheck.js";


const router = express.Router();
import upload from "../middlewares/multer.js";

router.get("/", userController.listUsers);
router.get("/profile", userController.profile);
router.get("/failedregister", userController.failedRegister);
router.get("/github", userController.loginWithGitHub);
router.post("/login", userController.login);
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.post("/:uid/documents", upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), userController.uploadDocuments);
router.put("/:uid", userController.editUser);
router.put("/premium/:uid", userController.changePremiumRole);router.delete('/delete-inactive',  userController.deleteInactive);
router.delete('/delete-inactive',  userController.deleteInactive);
router.delete('/:uid', checkUserRole(['admin']), userController.deleteUser);

// Registro de usuario normal (con inicio de sesión automático)
router.post("/register", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), (req, res) => {

    if (!req.user) {
        return res.status(400).send("Credenciales inválidas")
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cart: req.user.cart,
       
    }
    req.session.login = true;

    
    // Si la autenticación es exitosa, simplemente responde con un JSON
    return res.status(201).json({ success: true, message: "Usuario registrado y logueado con éxito.", payload: req.user });
});

// Registro de usuario por admin (sin inicio de sesión automático)
router.post("/admin/register", checkUserRole(['admin']), (req, res) => {
    req.body.isAdmin = true; // Este registro es realizado por un admin
    userController.registerUser(req, res);
});

export default router;






