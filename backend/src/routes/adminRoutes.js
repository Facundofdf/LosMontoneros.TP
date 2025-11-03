import { Router } from 'express';
import {
    createProduct,
    updateProduct,
    toggleProducto
} from '../controllers/productsController.js';
// import authAdmin from '../middlewares/authAdmin.js';

const router = Router();

// router.use(authAdmin); // se habilitará cuando exista auth

// CRUD admin
router.post('/', createProduct);          // POST /api/admin/productos
router.put('/:id', updateProduct);        // PUT /api/admin/productos/:id
router.patch('/:id/toggle', toggleProducto); // PATCH /api/admin/productos/:id/toggle

export default router;