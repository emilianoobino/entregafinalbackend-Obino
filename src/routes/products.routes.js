import express from "express";
const router = express.Router();

import ProductController from "../controllers/product.controller.js";
const productController = new ProductController();

import { uploadProdFile } from "../middlewares/multer.js";

// Defino las rutas
router.get("/", productController.getProducts);
router.get("/:pid",  productController.getProductById);
router.post("/", uploadProdFile.single("image"), productController.addProduct);
router.put("/:pid", uploadProdFile.single("image"), productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

// Exporto
export default router;

