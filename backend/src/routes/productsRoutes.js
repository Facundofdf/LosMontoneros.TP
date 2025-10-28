import express from 'express';
import { getAllProducts } from '../controllers/productsController.js';

const router = express.Router();

// GET /api/products
router.get('/', getAllProducts);

// Aquí puedes agregar más rutas como:
// router.post('/', createProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);

export default router;