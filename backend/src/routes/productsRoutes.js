import { Router } from 'express';
import { getAllProducts, getProductById } from '../controllers/productsController.js';

const router = Router();

// Catálogo público
router.get('/', getAllProducts);        // GET /api/productos
router.get('/:id', getProductById);     // GET /api/productos/:id

export default router;
