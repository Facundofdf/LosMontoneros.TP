import { Producto } from '../models/Producto.js';

// Controlador básico
export async function getAllProducts(req, res) {
    try {
        const { categoria, page = 1, limit = 10 } = req.query;
        
        const options = {
            where: { activo: true }, // Requerimiento 3 (solo activos)
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        };

        if (categoria) {
            options.where.categoria = categoria; // Requerimiento 2
        }

        // findAndCountAll es ideal para paginación
        const { count, rows } = await Producto.findAndCountAll(options);

        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            productos: rows // Requerimiento 1 y 3
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error });
    }
}
