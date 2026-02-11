const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    espacioUsado: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    }
}, { 
    tableName: 'usuario',
    timestamps: true 
});

module.exports = Usuario;