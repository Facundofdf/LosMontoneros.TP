import { Producto } from "../associations.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_ROOT = path.join(__dirname, '../../public');

const RUTA_BASE_IMAGENES = "/uploads/";

// Crear producto
export async function crearProducto(req, res) {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;

    if (!req.file){
      return res.status(400).json({error: "La imagen es obligatoria."});
    }

    const imagenUrl = RUTA_BASE_IMAGENES + req.file.filename;

    if (!nombre || !precio)
      return res.status(400).json({ error: "Nombre y precio son obligatorios" });

    const producto = await Producto.create({
      nombre,
      descripcion,
      precio: parseFloat(precio),
      imagen: imagenUrl,
      categoria,
      activo: true,
    });

    res.json({ message: "Producto creado correctamente", producto });
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Actualizar producto
export async function actualizarProducto(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });

    const datosParaActualizar = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      categoria,
    };

    if(req.file){
      const imagenUrl = RUTA_BASE_IMAGENES + req.file.filename;
      datosParaActualizar.imagen = imagenUrl;
    }

    await producto.update(datosParaActualizar);

    res.json({ message: "Producto actualizado", producto });
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Activar / desactivar
export async function toggleProductoActivo(req, res) {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });

    producto.activo = !producto.activo;
    await producto.save();

    res.json({
      message: "Estado actualizado",
      activo: producto.activo,
    });
  } catch (err) {
    console.error("Error al cambiar estado:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Eliminar producto
export async function eliminarProducto(req, res) {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto){
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    const imagePathInDB = producto.imagen;
    await producto.destroy();
    if(imagePathInDB){
      const relativeImagePath = imagePathInDB.substring(1);
      const fullPath = path.join(PUBLIC_ROOT, relativeImagePath);
      fs.unlink(fullPath, (err) => {
        if(err){
          console.error(`Error al eliminar archivo de imagen: ${fullPath}`, err);
        } else {
          console.log(`✅ Imagen eliminada: ${fullPath}`);
        }
      });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
