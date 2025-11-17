import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const LoginLog = sequelize.define("LoginLog", {
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
    }
}, { timestamps: false }); 

export default LoginLog;