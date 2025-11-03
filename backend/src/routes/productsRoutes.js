import express from 'express';
import { getAllProducts, getProductById } from '../controllers/productsController.js';

const router = express.Router();

// GET /api/products
router.get('/', getAllProducts);

router.get('/:id', getProductById);

// Aquí puedes agregar más rutas como:
// router.post('/', createProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);

export default router;