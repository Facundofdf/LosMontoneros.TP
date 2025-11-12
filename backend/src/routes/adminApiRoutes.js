import { Router } from "express";
import authAdminView from "../middlewares/authAdminView.js";
import { upload } from "../middlewares/upLoadImage.js";

// Controladores de productos (nuevo)
import {
  crearProducto,
  actualizarProducto,
  toggleProductoActivo,
  eliminarProducto,
} from "../controllers/adminProductsController.js";

// Controladores de admins
import {
  crearAdmin,
  actualizarAdmin,
  eliminarAdmin,
} from "../controllers/adminController.js";

const router = Router();

router.use(authAdminView);

// Productos
router.post("/productos", upload.single('imagen'), crearProducto);
// router.post("/productos", crearProducto);
router.put("/productos/:id", upload.single('imagen'), actualizarProducto);
// router.put("/productos/:id", actualizarProducto);
router.patch("/productos/:id/toggle", toggleProductoActivo);
router.delete("/productos/:id", eliminarProducto);

// Usuarios admin
router.post("/usuarios", crearAdmin);
router.put("/usuarios/:id", actualizarAdmin);
router.delete("/usuarios/:id", eliminarAdmin);

export default router;
