const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fichero = sequelize.define('Fichero', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ruta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_carpeta: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { 
    tableName: 'fichero',
    timestamps: true 
});

module.exports = Fichero;