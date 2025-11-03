// backend/src/models/UsuarioAdmin.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UsuarioAdmin = sequelize.define('UsuarioAdmin', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: false }); 

export default UsuarioAdmin;