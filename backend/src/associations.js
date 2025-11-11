// backend/src/associations.js
import Producto from './models/Producto.js';
import Venta from './models/Venta.js';
import VentaProducto from './models/VentaProducto.js';
import UsuarioAdmin from './models/UsuarioAdmin.js';


Venta.hasMany(VentaProducto, { foreignKey: 'ventaId', as: 'VentaProductos' });
VentaProducto.belongsTo(Venta, { foreignKey: 'ventaId', as: 'Venta' });
VentaProducto.belongsTo(Producto, { foreignKey: 'productoId', as: 'Producto' });


export { Producto, Venta, VentaProducto, UsuarioAdmin };
