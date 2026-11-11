const { Carpeta, Fichero } = require('../models/index');

const obtenerContenidoCarpeta = async (req, res) => {
    try {
        const { id } = req.params;

        // Si id es 'root', podríamos buscar las carpetas principales del usuario.
        // Por ahora, asumimos que pasas un ID numérico de la carpeta.
        const carpeta = await Carpeta.findByPk(id, {
            include: [
                {
                    model: Carpeta,
                    as: 'subcarpetas', // Relación definida en index.js
                    attributes: ['id', 'nombre']
                },
                {
                    model: Fichero,
                    attributes: ['id', 'nombre', 'ruta'] // Relación definida en index.js
                }
            ]
        });

        if (!carpeta) {
            return res.status(404).json({ error: 'Carpeta no encontrada' });
        }

        res.json({
            id: carpeta.id,
            nombre: carpeta.nombre,
            subcarpetas: carpeta.subcarpetas,
            ficheros: carpeta.Ficheros // Sequelize usa el nombre del modelo en plural por defecto si no se especificó un 'as'
        });
    } catch (error) {
        console.error('Error al obtener la carpeta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const crearCarpeta = async (req, res) => {
    try {
        const { nombre, parentId } = req.body;
        
        if (!nombre) {
            return res.status(400).json({ error: 'El nombre es obligatorio' });
        }

        const nuevaCarpeta = await Carpeta.create({ 
            nombre, 
            parentId: parentId || null 
        });

        res.status(201).json(nuevaCarpeta);
    } catch (error) {
        console.error('Error al crear carpeta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    obtenerContenidoCarpeta,
    crearCarpeta
};