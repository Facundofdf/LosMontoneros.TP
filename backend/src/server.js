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
import methodOverride from 'method-override';
import setLocalsAdmin from "./middlewares/setLocalsAdmin.js";

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
app.use(methodOverride('_method'));

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
app.use(setLocalsAdmin);

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
// 🌐 Servir archivos estáticos (CSS/JS) del Panel Admin
// ===============================
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
console.log(`📦 Sirviendo archivos estáticos de admin desde: ${publicPath}`);

// ===============================
// 📡 Rutas API
// ===============================
import routes from './routes/routes.js';
app.use("/", routes); // ✅ aquí se monta todo (admin, api, productos, ventas)

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
        // Sincroniza la BD sin eliminar tablas existentes
        await sequelize.sync({alter: true});
        console.log('💾 Base de datos sincronizada (sin eliminar datos)');

        // Verificar si existe el usuario admin por defecto
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const adminExists = await UsuarioAdmin.findOne({ where: { email: adminEmail } });

        if (!adminExists) {
            const hash = await bcrypt.hash(adminPassword, 10);
            await UsuarioAdmin.create({
                email: adminEmail,
                password_hash: hash
            });
            console.log('👤 Usuario admin creado por defecto');
        } else {
            console.log('✅ Usuario admin ya existente');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('💥 Error al inicializar el servidor:', error);
    }
}

startServer();
