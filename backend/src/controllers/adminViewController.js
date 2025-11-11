// backend/src/controllers/adminViewController.js
import { Producto, Venta, UsuarioAdmin } from '../associations.js';
// backend/src/controllers/adminViewController.js
export const renderLogin = (req, res) => {
    const { error } = req.query;
    res.render("admin/login", {
        layout: false, // 🚀 esto es lo que faltaba
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
            layout: "admin/layout", // ✅ acá sí va
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


export function renderProductoForm(req, res) {
    res.render('admin/form_producto', { producto: req.producto || null });
}