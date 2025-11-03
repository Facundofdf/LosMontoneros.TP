import { Producto } from '../models/producto.js';

export async function getAllProducts(req, res) {
    try {
        const { categoria, page = 1, limit = 10 } = req.query;
        
        const options = {
            where: { activo: true },
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        };

        if (categoria) {
            options.where.categoria = categoria; // Requerimiento 2
        }

        const { count, rows } = await Producto.findAndCountAll(options);

        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            productos: rows // Requerimiento 1 y 3
        });

    } catch (error) {
        console.log('Error: ' + error);
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const producto = await Producto.findOne({
            where: { id: id, activo: true } 
        });

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado o inactivo' });
        }

        res.json(producto);

    } catch (error) {
        console.error('Error detallado en getProductById:', error);
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
}