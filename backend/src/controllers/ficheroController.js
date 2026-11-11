const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Fichero } = require('../models/index');

// Configuración de almacenamiento físico
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Subir archivo
const subirFichero = async (req, res) => {
    try {
        const { carpetaId } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ningún archivo' });
        }

        const nuevoFichero = await Fichero.create({
            nombre: req.file.originalname,
            ruta: req.file.filename,
            id_carpeta: carpetaId || 1
        });

        res.status(201).json(nuevoFichero);
    } catch (error) {
        console.error('Error al subir fichero:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Descargar/Servir archivo físico
const descargarFichero = async (req, res) => {
    try {
        const fichero = await Fichero.findByPk(req.params.id);
        if (!fichero) return res.status(404).json({ error: 'Archivo no encontrado' });

        const rutaFisica = path.join(__dirname, '../../uploads', fichero.ruta);
        res.download(rutaFisica, fichero.nombre);
    } catch (error) {
        console.error('Error al descargar:', error);
        res.status(500).json({ error: 'Error al descargar' });
    }
};

// Eliminar archivo de la BD y del disco
const eliminarFichero = async (req, res) => {
    try {
        const fichero = await Fichero.findByPk(req.params.id);
        if (!fichero) return res.status(404).json({ error: 'Archivo no encontrado' });

        const rutaFisica = path.join(__dirname, '../../uploads', fichero.ruta);
        if (fs.existsSync(rutaFisica)) {
            fs.unlinkSync(rutaFisica);
        }

        await fichero.destroy();
        res.json({ mensaje: 'Archivo eliminado' });
    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).json({ error: 'Error al eliminar' });
    }
};

module.exports = {
    upload,
    subirFichero,
    descargarFichero,
    eliminarFichero
};