import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Definir dónde guardar los archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // La carpeta 'public' está en el root de 'backend',
        // subimos dos niveles desde 'middlewares/uploadImage.js'
        const destPath = path.join(__dirname, '../../public/uploads/');
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        // Generar un nombre único para el archivo
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// 2. Filtro de archivos (para aceptar solo imágenes)
const fileFilter = (req, file, cb) => {
    const mimetypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (mimetypes.includes(file.mimetype)) {
        cb(null, true); // Aceptar el archivo
    } else {
        cb(new Error('Formato de archivo no soportado'), false); // Rechazar
    }
};

// 3. Crear y exportar la instancia de Multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Límite de 5MB
    }
});