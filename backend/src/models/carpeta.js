const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Carpeta = sequelize.define('Carpeta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { 
    tableName: 'carpeta',
    timestamps: true 
});

module.exports = Carpeta;