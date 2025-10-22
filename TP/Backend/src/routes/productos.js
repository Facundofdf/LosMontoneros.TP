import express from "express";

const router = express.Router();

router.get("/", obtenerProductos);
router.post("/", crearProducto);
router.put("/:id", modificarProducto);
router.delete("/:id", eliminarProducto);

export default router;
