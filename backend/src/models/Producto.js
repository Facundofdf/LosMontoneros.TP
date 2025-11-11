import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Producto = sequelize.define("Producto",  {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    precio:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    imagen:{
        type: DataTypes.STRING,
        allowNull: false
    },
    categoria:{
        type: DataTypes.STRING,
        allowNull: false
    },
    activo:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    } 
}, {timestamps: true}
);

export default Producto;