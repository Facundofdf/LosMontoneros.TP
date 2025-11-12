import bcrypt from 'bcrypt';
import UsuarioAdmin from '../models/UsuarioAdmin.js';
import { Producto } from '../associations.js';

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('admin/login', {
                error: 'Faltan datos para iniciar sesión',
            });
        }

        const admin = await UsuarioAdmin.findOne({ where: { email } });

        if (!admin) {
            return res.status(401).render('admin/login', {
                error: 'Credenciales inválidas',
            });
        }

        const ok = await bcrypt.compare(password, admin.password_hash);
        if (!ok) {
            return res.status(401).render('admin/login', {
                error: 'Credenciales inválidas',
            });
        }

        // 🟢 Guardar datos en sesión
        req.session.adminId = admin.id;
        req.session.adminEmail = admin.email;

        console.log(`Admin logueado: ${admin.email}`);
        return res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error en login admin:', error);
        res.status(500).render('admin/login', {
            error: 'Error interno del servidor',
        });
    }
}

export function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/admin/login');
    });
}

export async function loginAPI(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: 'Faltan datos para iniciar sesión' });

        const admin = await UsuarioAdmin.findOne({ where: { email } });
        if (!admin)
            return res.status(401).json({ error: 'Credenciales inválidas' });

        const ok = await bcrypt.compare(password, admin.password_hash);
        if (!ok)
            return res.status(401).json({ error: 'Credenciales inválidas' });

        // Guardar sesión igual que en el login EJS
        req.session.adminId = admin.id;
        req.session.adminEmail = admin.email;

        console.log(`✅ Admin logueado vía API: ${admin.email}`);

        return res.json({
            message: 'Inicio de sesión exitoso',
            admin: {
                id: admin.id,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('💥 Error en login API admin:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function crearProducto(req, res) {
    try {
        // Los datos vienen del formulario EJS
        const { nombre, descripcion, precio, imagen, categoria } = req.body;

        // Validaciones básicas (puedes agregar más)
        if (!nombre || !precio) {
            // Si algo falla, re-renderiza el formulario con un error
            return res.status(400).render('admin/form_producto', {
                error: 'Nombre y Precio son obligatorios',
                producto: req.body // Devuelve los datos para no perderlos
            });
        }

        // Crea el producto en la base de datos
        const nuevoProducto = await Producto.create({
            nombre,
            descripcion,
            precio: parseFloat(precio),
            imagen,
            categoria,
            activo: true // O el valor por defecto que prefieras
        });

        console.log(`✅ Producto creado: ${nuevoProducto.nombre}`);

        // Como es un formulario HTML, redirigimos al dashboard
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.error('💥 Error al crear producto:', error);
        res.status(500).render('admin/form_producto', {
            error: 'Error interno del servidor',
            producto: req.body
        });
    }
}

/**
 * Actualiza un producto existente.
 * Responde con una redirección al dashboard.
 */
export async function actualizarProducto(req, res) {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, imagen, categoria } = req.body;

        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).render('admin/form_producto', {
                error: 'Producto no encontrado',
                producto: req.body
            });
        }

        // Actualiza el producto
        await producto.update({
            nombre,
            descripcion,
            precio: parseFloat(precio),
            imagen,
            categoria
        });

        console.log(`✅ Producto actualizado: ${producto.nombre}`);

        // Redirigimos al dashboard
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.error('💥 Error al actualizar producto:', error);
        res.status(500).render('admin/form_producto', {
            error: 'Error interno del servidor',
            producto: { ...req.body, id } // Devuelve los datos
        });
    }
}

/**
 * Activa o desactiva un producto.
 * Responde con JSON.
 */
export async function toggleProductoActivo(req, res) {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Invierte el valor booleano
        producto.activo = !producto.activo;
        await producto.save();

        console.log(`✅ Estado cambiado: ${producto.nombre} (Activo: ${producto.activo})`);

        // El frontend (admin-dashboard.js) espera un res.ok
        res.status(200).json({
            message: 'Estado actualizado',
            activo: producto.activo
        });

    } catch (error) {
        console.error('💥 Error al cambiar estado de producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

/**
 * Elimina un producto.
 * Responde con JSON.
 */
export async function eliminarProducto(req, res) {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Elimina el producto de la base de datos
        await producto.destroy();

        console.log(`✅ Producto eliminado: ${producto.nombre}`);

        // El frontend (admin-dashboard.js) espera un res.ok
        res.status(200).json({ message: 'Producto eliminado exitosamente' });

    } catch (error) {
        console.error('💥 Error al eliminar producto:', error);
        // Manejo de errores (ej: si el producto está en una Venta)
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ error: 'No se puede eliminar el producto, está asociado a una venta.' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}