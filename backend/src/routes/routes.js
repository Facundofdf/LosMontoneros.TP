import express from "express";
import productsRoutes from "./productsRoutes.js";        // API pública
import adminViewRoutes from "./adminViewRoutes.js";       // vistas EJS del panel
import adminApiRoutes from "./adminApiRoutes.js";         // API interna del panel
import ventasRoutes from "./ventasRoutes.js";             // API de ventas

const router = express.Router();

// ==========================
// Vistas del panel admin
// ==========================
router.use("/admin", adminViewRoutes);

// ==========================
// API administrativa (panel)
// ==========================
router.use("/api/admin", adminApiRoutes);

// ==========================
// API pública (tienda)
// ==========================
router.use("/api/productos", productsRoutes);
router.use("/api/ventas", ventasRoutes);

// ==========================
// Manejador de errores
// ==========================
// backend/src/routes/routes.js (AL FINAL - CORREGIDO)

// ==========================
// Manejador de errores
// ==========================
router.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      error: "Ruta API no encontrada",
      path: req.originalUrl,
    });
  }
  next();
});

export default router;