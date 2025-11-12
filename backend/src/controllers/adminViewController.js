import { Producto, Venta, UsuarioAdmin } from '../associations.js';

export const renderLogin = (req, res) => {
    const { error } = req.query;
    res.render("admin/login", {
        layout: false, //
        title: "Iniciar sesión",
        error: error || null
    });
};

export const renderDashboard = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        const totales = {
            activos: productos.filter(p => p.activo).length,
            ventas: 0,
            admins: 0
        };

        res.render("admin/dashboard", {
            layout: "admin/layout",
            title: "Dashboard",
            productos,
            totales,
            ventas: [],
            admins: []
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error interno del servidor");
    }
};

/**
 * Middleware para cargar un producto por ID y adjuntarlo a req.producto
 */
export async function cargarProducto(req, res, next) {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            // Si no lo encuentra, redirige al dashboard o muestra un error
            console.warn(`Intento de editar producto no existente: ${id}`);
            return res.redirect('/admin/dashboard');
        }

        // ¡Éxito! Adjuntamos el producto al request
        req.producto = producto;
        next(); // Pasamos al siguiente middleware (renderProductoForm)

    } catch (error) {
        console.error('Error al cargar producto:', error);
        res.redirect('/admin/dashboard');
    }
}

export function renderProductoForm(req, res) {
    res.render('admin/form_producto', { producto: req.producto || null });
}