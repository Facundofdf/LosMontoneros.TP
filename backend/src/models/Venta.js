import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const  Venta = sequelize.define("Venta", {
  clienteNombre:{
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha:{
    type: DataTypes.DATE,
    allowNull: false
  },
  total:{
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },

}, {timestamps: true});

export default Venta;