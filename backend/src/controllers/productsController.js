import Producto from '../models/Producto.js';

<<<<<<< Updated upstream
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
=======
// Controlador básico
export const listProducts = async (req, res) => {
    const { categoria, pagina = 1, limite = 8 } = req.query;

    const offset = (pagina - 1) * limite;
    const where = { activo: true };

    if (categoria) where.categoria = categoria;

    const productos = await Producto.findAndCountAll({
        where,
        limit: Number(limite),
        offset: Number(offset)
    });

    res.json({
        total: productos.count,
        pagina: Number(pagina),
        paginas: Math.ceil(productos.count / limite),
        data: productos.rows
    });
};

export async function getProduct(req, res) {
    try {
        const { id } = req.params;
        const producto = await Producto.findOne({
            where: { id: id, activo: true }
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
export const createProduct = async (req, res) => {
    const { nombre, descripcion, precio, imagen, categoria } = req.body;
    const nuevo = await Producto.create({ nombre, descripcion, precio, imagen, categoria, activo: true });
    res.json(nuevo);
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen, categoria } = req.body;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ error: true });
    await producto.update({ nombre, descripcion, precio, imagen, categoria });
    res.json(producto);
}

export const toggleProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);

        if (!producto)
            return res.status(404).json({ error: true, message: "Producto no encontrado" });

        // Cambia el estado de activo a su opuesto
        const nuevoEstado = !producto.activo;

        await producto.update({ activo: nuevoEstado });

        res.json({ ok: true, activo: nuevoEstado });
    } catch (error) {
        console.error("Error al cambiar el estado del producto:", error);
        res.status(500).json({ error: true, message: "Error interno del servidor" });
    }
};
>>>>>>> Stashed changes
