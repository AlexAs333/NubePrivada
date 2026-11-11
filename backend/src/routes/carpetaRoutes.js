const express = require('express');
const router = express.Router();
// Importamos la nueva función
const { obtenerContenidoCarpeta, crearCarpeta } = require('../controllers/carpetaController');

// Ruta para crear una nueva carpeta
router.post('/', crearCarpeta);

// Ruta para obtener el contenido (la que ya tenías)
router.get('/:id', obtenerContenidoCarpeta);

module.exports = router;