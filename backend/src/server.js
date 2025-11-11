// ===============================
// 🌱 Configuración base del servidor
// ===============================
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { sequelize } from './config/database.js';
import './associations.js';
import bcrypt from 'bcrypt';
import UsuarioAdmin from './models/UsuarioAdmin.js';
import expressLayouts from 'express-ejs-layouts';

// ===============================
// 🔧 Cargar configuración .env
// ===============================
dotenv.config({ path: path.resolve('../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4000;

console.log('🌿 .env cargado correctamente');
console.log('🧭 Entorno:', process.env.NODE_ENV);

// ===============================
// 🚀 Inicializar aplicación
// ===============================
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// 🌍 Configuración CORS
// ===============================
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: process.env.CORS_CREDENTIALS === 'true'
}));

// ===============================
// 🔐 Configuración de sesión
// ===============================
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}));

// ===============================
// 🖼 Configuración de vistas (EJS)
// ===============================
const viewsPath = path.resolve(__dirname, '..', process.env.VIEWS_PATH);
app.set('views', viewsPath);
app.set('view engine', process.env.VIEW_ENGINE || 'ejs');

// Configuración de express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'admin/layout'); // layout por defecto para las vistas admin

// Middleware para variable global en todas las vistas
app.use((req, res, next) => {
    res.locals.title = 'Panel Administrativo';
    next();
});

console.log(`🖼  Motor de vistas: ${process.env.VIEW_ENGINE}`);
console.log(`📁 Directorio de vistas: ${viewsPath}`);

// ===============================
// 🧭 Cargar vistas dinámicamente
// ===============================
const viewRoutes = process.env.VIEW_ROUTES?.split(',').map(v => v.trim()) || [];
for (const viewName of viewRoutes) {
    try {
        const module = await import(`./routes/${viewName}ViewRoutes.js`);
        app.use(`/${viewName}`, module.default);
        console.log(`✅ Vista registrada: /${viewName}`);
    } catch (err) {
        console.warn(`⚠️  No se pudo cargar la vista /${viewName}: ${err.message}`);
    }
}

// ===============================
// 📡 Rutas API
// ===============================
import apiRoutes from './routes/routes.js';
app.use('/api', apiRoutes);

// ===============================
// 🌐 Servir frontend (SPA)
// ===============================
const frontendPath = path.resolve(__dirname, '..', process.env.FRONTEND_PATH);
const frontendRoutes = process.env.FRONTEND_ROUTES?.split(',').map(r => r.trim()) || [];

app.use(express.static(frontendPath));
console.log(`🧩 Frontend servido desde: ${frontendPath}`);

app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Ruta API no encontrada' });
    }
    if (frontendRoutes.includes(req.path)) {
        return res.sendFile(path.join(frontendPath, 'index.html'));
    }
    res.status(404).send('Página no encontrada');
});

// ===============================
// 🧠 Inicialización del servidor
// ===============================
async function startServer() {
    try {
        if (process.env.SEQUELIZE_FORCE_SYNC === 'true') {
            await sequelize.sync({ force: true });
            console.log('💾 Base de datos sincronizada (force: true)');

            // Crear admin por defecto
            const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await UsuarioAdmin.create({
                email: process.env.ADMIN_EMAIL,
                password_hash: hash
            });
            console.log('👤 Usuario admin creado por defecto');
        } else {
            await sequelize.sync();
            console.log('💾 Base de datos sincronizada (normal)');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('💥 Error al inicializar el servidor:', error);
    }
}

startServer();
