//AdminController.js
import bcrypt from "bcrypt";
import UsuarioAdmin from "../models/UsuarioAdmin.js";
import LoginLog from "../models/LoginLog.js";

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render("admin/login", {
                layout: false,
                title: "Iniciar sesión",
                error: "Faltan datos para iniciar sesión",
            });
        }

        const admin = await UsuarioAdmin.findOne({ where: { email } });
        if (!admin) {
            return res.status(401).render("admin/login", {
                layout: false,
                title: "Iniciar sesión",
                error: "Credenciales inválidas",
            });
        }

        const valid = await bcrypt.compare(password, admin.password_hash);
        if (!valid) {
            return res.status(401).render("admin/login", {
                layout: false,
                title: "Iniciar sesión",
                error: "Credenciales inválidas",
            });
        }

        try {
            await LoginLog.create({
                adminId: admin.id
            });
            console.log(`✅ Log de inicio de sesión registrado para: ${admin.email}`);
        } catch (logError) {
            console.error("💥 Error al guardar el log de inicio de sesión:", logError);
        }

        req.session.adminId = admin.id;
        req.session.adminEmail = admin.email;

        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error("Error en login admin:", err);
        res.status(500).render("admin/login", {
            layout: false,
            title: "Iniciar sesión",
            error: "Error interno del servidor",
        });
    }
}

/** LOGOUT */
export function logout(req, res) {
    req.session.destroy(() => res.redirect("/admin/login"));
}

/** CREAR ADMIN */
export async function crearAdmin(req, res) {
    try {
        const { email, password, rol } = req.body;

        if (!email || !password) {
            return res.status(400).render("admin/form_usuario", {
                layout: "admin/layout",
                title: "Nuevo administrador",
                error: "Faltan campos obligatorios",
                usuario: req.body
            });
        }

        const existe = await UsuarioAdmin.findOne({ where: { email } });
        if (existe) {
            return res.status(409).render("admin/form_usuario", {
                layout: "admin/layout",
                title: "Nuevo administrador",
                error: "El correo ya está registrado",
                usuario: req.body
            });
        }

        const password_hash = await bcrypt.hash(password, 10);
        await UsuarioAdmin.create({ email, password_hash, rol: rol || "admin" });

        console.log(`✅ Administrador creado: ${email}`);
        res.redirect("/admin/usuarios"); // 🔁 redirige a la lista
    } catch (err) {
        console.error("Error al crear admin:", err);
        res.status(500).render("admin/form_usuario", {
            layout: "admin/layout",
            title: "Nuevo administrador",
            error: "Error interno del servidor",
            usuario: req.body
        });
    }
}

/** ACTUALIZAR ADMIN */
export async function actualizarAdmin(req, res) {
    try {
        const { id } = req.params;
        const { email, password, rol } = req.body;

        const admin = await UsuarioAdmin.findByPk(id);
        if (!admin) {
            return res.status(404).render("admin/form_usuario", {
                layout: "admin/layout",
                title: "Editar administrador",
                error: "Administrador no encontrado",
                usuario: req.body
            });
        }

        const updates = { email, rol };
        if (password) updates.password_hash = await bcrypt.hash(password, 10);

        await admin.update(updates);

        console.log(`✅ Administrador actualizado: ${email}`);
        res.redirect("/admin/usuarios"); // 🔁 redirige al listado
    } catch (err) {
        console.error("Error al actualizar admin:", err);
        res.status(500).render("admin/form_usuario", {
            layout: "admin/layout",
            title: "Editar administrador",
            error: "Error interno del servidor",
            usuario: req.body
        });
    }
}
/** ELIMINAR ADMIN */

export async function eliminarAdmin(req, res) {
    try {
        const { id } = req.params;

        // 🔒 No permitir eliminar el propio usuario activo
        if (req.session.adminId && Number(req.session.adminId) === Number(id)) {
            return res.status(403).json({
                error: "No puedes eliminar tu propio usuario mientras esté en sesión."
            });
        }

        const admin = await UsuarioAdmin.findByPk(id);
        if (!admin) return res.status(404).json({ error: "Administrador no encontrado" });

        await admin.destroy();
        res.json({ message: "Administrador eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar admin:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
