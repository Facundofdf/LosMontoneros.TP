import express from 'express';
import productsRoutes from './productsRoutes.js';

const router = express.Router();

// Agrupar todas las rutas API 
router.use('/productos', productsRoutes);

// Manejador de errores
router.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta API no encontrada',
        path: req.originalUrl
    });
});

export default router;