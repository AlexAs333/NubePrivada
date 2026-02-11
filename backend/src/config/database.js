const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'nube_privada',
    process.env.DB_USER || 'admin',
    process.env.DB_PASSWORD || 'password123',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false // Para no ensuciar la consola con SQL
    }
);

module.exports = sequelize;