// backend/src/controllers/adminReportesController.js
import exceljs from 'exceljs';
import { sequelize } from "../config/database.js";
import {
    Producto,
    Venta,
    VentaProducto,
    LoginLog,
    UsuarioAdmin,
} from "../associations.js";

export const exportarReportes = async (req, res) => {
    const workbook = new exceljs.Workbook();
    workbook.creator = 'AdminPanel';
    workbook.created = new Date();

    try {
        // Top 10 Ventas 
        const sheetVentas = workbook.addWorksheet('Top 10 Ventas');
        // Columnas
        sheetVentas.columns = [
            { header: 'ID Venta', key: 'id', width: 10 },
            { header: 'Cliente', key: 'clienteNombre', width: 30 },
            { header: 'Fecha', key: 'fecha', width: 15 },
            // Damos formato de moneda a la columna 'total'
            { header: 'Total', key: 'total', width: 15, style: { numFmt: '$#,##0.00' } }
        ];
        // Buscamos los datos (igual que en renderRegistros)
        const topVentas = await Venta.findAll({ order: [['total', 'DESC']], limit: 10 });
        // Añadimos las filas
        sheetVentas.addRows(topVentas.map(v => v.dataValues));


        // Creamos la HOJA 2: Top 10 Productos 
        const sheetProductos = workbook.addWorksheet('Top 10 Productos');
        sheetProductos.columns = [
            { header: 'Producto', key: 'producto', width: 30 },
            { header: 'Unidades Vendidas', key: 'totalVendido', width: 20 }
        ];
        // Buscamos los datos. la misma consulta de renderRegistros
        const topProductos = await VentaProducto.findAll({
            attributes: [
                "productoId",
                [sequelize.fn("SUM", sequelize.col("cantidad")), "totalVendido"],
            ],
            group: ["productoId", "producto.id", "producto.nombre"],
            order: [[sequelize.literal("totalVendido"), "DESC"]],
            limit: 10,
            include: [{ model: Producto, as: "producto", attributes: ["nombre"] }],
        });
        // Mapeamos los datos para que coincidan con las columnas
        const productosData = topProductos.map(item => ({
            producto: item.producto?.nombre || 'N/A',
            totalVendido: item.dataValues.totalVendido
        }));
        sheetProductos.addRows(productosData);


        // Creamos la HOJA 3: Logs de Sesión 
        const sheetLogs = workbook.addWorksheet('Logs de Sesión');
        sheetLogs.columns = [
            { header: 'Usuario', key: 'email', width: 30 },
            { header: 'Fecha', key: 'fecha', width: 30 }
        ];
        // Buscamos los datos
        const loginLogs = await LoginLog.findAll({
            include: [{ model: UsuarioAdmin, attributes: ["email"] }],
            order: [["fecha", "DESC"]],
            limit: 50 // ¡Pongamos más límite para el excel!
        });
        // Mapeamos los datos
        const logsData = loginLogs.map(log => ({
            email: log.UsuarioAdmin?.email || 'N/A',
            fecha: new Date(log.fecha).toLocaleString()
        }));
        sheetLogs.addRows(logsData);


        // Enviamos el archivo al cliente
        // Le decimos al navegador que esto es un archivo Excel
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        // Le decimos al navegador qué nombre debe tener el archivo
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="reportes-los-montoneros.xlsx"'
        );

        // Escribimos el libro de Excel en la respuesta (res)
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error("Error al exportar Excel:", err);
        res.status(500).send("Error al generar el reporte");
    }
};