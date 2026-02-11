require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models/index');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Conectar y sincronizar base de datos
        // { alter: true } actualiza las tablas sin borrar los datos
        await sequelize.sync({ alter: true });
        console.log(' Base de datos sincronizada correctamente.');

        app.listen(PORT, () => {
            console.log(` Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(' Error al conectar con la base de datos:', error);
    }
}

startServer();