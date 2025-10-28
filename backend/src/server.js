// ===============================
// 🌱 Configuración base del servidor
// ===============================
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar .env desde la raíz del backend
dotenv.config({ path: path.resolve('../.env') });
const frontendRoutes = process.env.FRONTEND_ROUTES.split(',');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ===============================
// Variables de entorno
// ===============================
const PORT = process.env.PORT || 3000;

// ===============================
// Rutas API
// ===============================
import apiRoutes from './routes/routes.js';
app.use('/api', apiRoutes);

// ===============================
// Servir frontend (VA DESPUÉS)
// ===============================
const frontendPath = path.join(__dirname, '../../frontend/src');
app.use(express.static(frontendPath));

// Fallback para SPA (VA AL FINAL)
app.get('*', (req, res) => {
    // Si es ruta API, dejar pasar
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API no encontrada' });

    // Si es ruta estática (css/js/img), dejar pasar
    if (req.path.includes('.')) return res.status(404).send('Archivo no encontrado');

    // Si la ruta está definida en frontendRoutes
    if (frontendRoutes.includes(req.path)) {
        return res.sendFile(path.join(frontendPath, 'index.html'));
    }

    // Ruta no válida
    res.status(404).send('Página no encontrada');
});
// ===============================
// Inicialización del servidor
// ===============================
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
