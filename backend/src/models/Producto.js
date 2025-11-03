import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Producto = sequelize.define("Producto", 
    {    
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING,
        },
        precio: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        categoria: {
            type: DataTypes.STRING,
        },
        imagen: {
            type: DataTypes.STRING,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
    timestamps: false
    }
);
