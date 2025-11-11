// ===============================
// 👤 Controlador de autenticación Admin
// ===============================
import bcrypt from 'bcrypt';
import UsuarioAdmin from '../models/UsuarioAdmin.js';

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

// ===============================
// 💡 Nueva versión JSON (API)
// ===============================
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
