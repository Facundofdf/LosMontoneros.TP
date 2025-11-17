// backend/src/controllers/adminViewController.js
import { sequelize } from "../config/database.js";
import { Producto, Venta, UsuarioAdmin, VentaProducto, LoginLog } from "../associations.js";

/** Vista de login */
export const renderLogin = (req, res) => {
    const { error } = req.query;
    res.render("admin/login", {
        layout: false,
        title: "Iniciar sesión",
        error: error || null
    });
};

/** Dashboard */
export const renderDashboard = async (req, res) => {
    try {
        const [productos, ventas, admins] = await Promise.all([
            Producto.findAll({
                order: [["categoria", "ASC"], ["nombre", "ASC"]],
            }),
            Venta.findAll({
                include: [
                    {
                        model: VentaProducto,
                        as: "ventaProductos",
                        include: [{ model: Producto, as: "producto" }],
                    },
                ],
                order: [["fecha", "DESC"]],
            }),
            UsuarioAdmin.findAll(),
        ]);

        const totales = {
            activos: productos.filter((p) => p.activo).length,
            ventas: ventas.length,
            admins: admins.length,
        };

        res.render("admin/dashboard", {
            layout: "admin/layout",
            title: "Dashboard",
            productos,
            ventas,
            admins,
            totales,
        });
    } catch (err) {
        console.error("Error al renderizar dashboard:", err);
        res.status(500).send("Error interno del servidor");
    }
};

/** Middleware para cargar producto */
export async function cargarProducto(req, res, next) {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            console.warn(`Intento de editar producto no existente: ${id}`);
            return res.redirect("/admin/dashboard");
        }

        req.producto = producto;
        next();
    } catch (error) {
        console.error("Error al cargar producto:", error);
        res.redirect("/admin/dashboard");
    }
}

/** Formulario de producto */
export function renderProductoForm(req, res) {
    res.render("admin/form_producto", {
        layout: "admin/layout",
        title: req.producto ? "Editar producto" : "Nuevo producto",
        producto: req.producto || null
    });
}

/** Vista de ventas */
export const renderVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [
                {
                    model: VentaProducto,
                    as: "ventaProductos",
                    include: [{ model: Producto, as: "producto" }]
                }
            ],
            order: [["fecha", "DESC"]]
        });

        res.render("admin/ventas", {
            layout: "admin/layout",
            title: "Ventas",
            ventas
        });
    } catch (err) {
        console.error("Error al listar ventas:", err);
        res.status(500).send("Error interno del servidor");
    }
};

/** Vista de administradores */
export const renderUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuarioAdmin.findAll({ order: [["id", "ASC"]] });
        res.render("admin/usuarios", {
            layout: "admin/layout",
            title: "Administradores",
            usuarios
        });
    } catch (err) {
        console.error("Error al listar administradores:", err);
        res.status(500).send("Error interno del servidor");
    }
};

export const renderUsuarioForm = (req, res) => {
    res.render("admin/form_usuario", {
        layout: "admin/layout",
        title: "Nuevo administrador",
        usuario: null,
        error: null
    });
};

/** Formulario de edición de administrador */
export const renderEditarAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await UsuarioAdmin.findByPk(id);

        if (!admin) {
            console.warn(`Intento de editar admin no existente: ${id}`);
            return res.redirect("/admin/usuarios");
        }

        res.render("admin/form_usuario", {
            layout: "admin/layout",
            title: "Editar administrador",
            usuario: admin,
            error: null
        });
    } catch (err) {
        console.error("Error al cargar admin para edición:", err);
        res.redirect("/admin/usuarios");
    }
};

/** Vista de Registros y Estadísticas */
export const renderRegistros = async (req, res) => {
    try {
        //Top 10 Ventas Más Caras
        const topVentas = await Venta.findAll({
            order: [["total", "DESC"]], // Orden descendente
            limit: 10,
        });

        //Top 10 Productos Más Vendidos
        const topProductos = await VentaProducto.findAll({
            attributes: [
                "productoId",
                [sequelize.fn("SUM", sequelize.col("cantidad")), "totalVendido"],
            ],
            group: ["productoId", "producto.id", "producto.nombre"],
            order: [[sequelize.literal("totalVendido"), "DESC"]],
            limit: 10,
            include: [
                {
                    model: Producto,
                    as: "producto", // Usamos el 'as' de la asociación
                    attributes: ["nombre"], // Solo el nombre
                },
            ],
        });

        //Log de Inicios de Sesión
        const loginLogs = await LoginLog.findAll({
            include: [{
                model: UsuarioAdmin, // Incluimos UsuarioAdmin
                attributes: ["email"]  // para ver su email
            }],
            order: [["fecha", "DESC"]], // Los más recientes primero
            limit: 20, //límite de 20
        });

        // Otras 2 estadísticas...
        // Total de ventas
        const totalVentas = await Venta.count();
        // Total de productos registrados
        const totalProductos = await Producto.count();

        res.render("admin/registros", { // Renderiza la nueva vista
            layout: "admin/layout",
            title: "Registros y Estadísticas",
            // ¡Pasamos todos los datos a la vista EJS!
            topVentas: topVentas,
            topProductos: topProductos,
            loginLogs: loginLogs,
            stats: { // Pasamos las estadísticas extra en un objeto
                totalVentas: totalVentas,
                totalProductos: totalProductos
            }
        });
    } catch (err) {
        console.error("Error al renderizar registros:", err);
        res.status(500).send("Error interno del servidor");
    }
};