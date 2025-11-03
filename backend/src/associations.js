// backend/src/associations.js
import Producto from './models/Producto.js';
import Venta from './models/Venta.js';
import VentaProducto from './models/VentaProducto.js';
import UsuarioAdmin from './models/UsuarioAdmin.js';

// Relaciones
Venta.hasMany(VentaProducto, { foreignKey: 'ventaId' });
VentaProducto.belongsTo(Venta, { foreignKey: 'ventaId' });

Producto.hasMany(VentaProducto, { foreignKey: 'productoId' });
VentaProducto.belongsTo(Producto, { foreignKey: 'productoId' });

export { Producto, Venta, VentaProducto, UsuarioAdmin };
