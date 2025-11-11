import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const VentaProducto = sequelize.define("VentaProductos", {
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precioUnitario:{
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, { timestamps: true });

export default VentaProducto;