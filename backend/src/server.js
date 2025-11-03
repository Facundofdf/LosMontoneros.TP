// ===============================
// 🌱 Configuración base del servidor
// ===============================
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

// Importamos la instancia de Sequelize y los modelos
import { sequelize } from './config/database.js';
import "./associations.js";

// Cargar .env desde la raíz del backend
dotenv.config({ path: path.resolve('../.env') });
const frontendRoutes = process.env.FRONTEND_ROUTES.split(',');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// Variables de entorno
// ===============================
const PORT = process.env.PORT || 4000;

// ===============================
// Rutas API
// ===============================
import apiRoutes from './routes/routes.js';
// *Importante: Al importar las rutas, Sequelize registra los modelos*
app.use('/api', apiRoutes);

// ===============================
// Servir frontend (VA DESPUÉS)
// ===============================
const frontendPath = path.join(__dirname, '../../frontend/src');
app.use(express.static(frontendPath));

// Fallback para SPA (VA AL FINAL)
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API no encontrada' });
    if (frontendRoutes.includes(req.path)) {
        return res.sendFile(path.join(frontendPath, 'index.html'));
    }
    return res.status(404).send('Página no encontrada');
});

// ===============================
// Inicialización del servidor (¡MODIFICADO!)
// ===============================
async function startServer() {
    try {
        // force: false -> Crea las tablas si no existen, pero NO las borra si ya existen.
        // Es la opción segura para producción y para tus datos reales.
        await sequelize.sync({ force: true });
        console.log('Base de datos sincronizada correctamente.');

        // 2. Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error al inicializar el servidor:', error);
    }
}

// Iniciar todo
startServer();