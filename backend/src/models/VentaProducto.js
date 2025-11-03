import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const VentaProducto = sequelize.define("Venta", {
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precioUnitario:{
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, { timestamps: false });

export default VentaProducto;