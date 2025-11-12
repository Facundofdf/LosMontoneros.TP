import express from "express";
// Importamos los controladores de API (los que manejan JSON)
import {
    crearProducto,
    actualizarProducto,
    toggleProductoActivo,
    eliminarProducto
    // agregar "obtenerProductosAdmin" o "eliminarProducto" si los necesitas
} from "../controllers/adminController.js";
// NOTA: Asegúrate de que los nombres "crearProducto" y "actualizarProducto"
// existan en adminController.js

const router = express.Router();

// ===================================
// RUTAS API PARA EL PANEL ADMIN
// (Montadas bajo /api/admin)
// ===================================

// POST /api/admin/productos
// Se usa para crear un nuevo producto desde el form_producto.ejs
router.post("/productos", crearProducto);

// PUT /api/admin/productos/:id
// Se usa para actualizar un producto desde el form_producto.ejs
router.put("/productos/:id", actualizarProducto);

// Aquí puedes agregar más rutas de API de admin si las necesitas
// ej: router.delete("/productos/:id", eliminarProducto);
// ej: router.get("/productos", obtenerProductosAdmin);

router.patch("/productos/:id/toggle", toggleProductoActivo);
router.delete("/productos/:id", eliminarProducto);

export default router;