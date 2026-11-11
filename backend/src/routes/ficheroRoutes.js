const express = require('express');
const router = express.Router();
const { upload, subirFichero, descargarFichero, eliminarFichero } = require('../controllers/ficheroController');

router.post('/', upload.single('archivo'), subirFichero);
router.get('/:id/download', descargarFichero);
router.delete('/:id', eliminarFichero);

module.exports = router;