import express from "express";
import {
  renderLogin,
  renderDashboard,
  renderProductoForm,
} from "../controllers/adminViewController.js";
import {
  crearProducto,
  obtenerProductos,
} from "../controllers/adminController.js";

const router = express.Router();

// Vistas
router.get("/login", renderLogin);
router.get("/dashboard", renderDashboard);
router.get("/productos/nuevo", renderProductoForm);

// API (JSON)
router.get("/api/admin/productos", obtenerProductos);
router.post("/api/admin/productos", crearProducto);

export default router;
