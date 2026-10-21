const Usuario = require('./usuario');
const Carpeta = require('./carpeta');
const Fichero = require('./fichero');
const Etiqueta = require('./etiqueta');
const sequelize = require('../config/database');

// Relación N:N Usuario - Carpeta
// Se crea tabla 'usuario_carpeta' con columnas 'id_user' e 'id_carpeta'
Usuario.belongsToMany(Carpeta, { 
    through: 'usuario_carpeta', 
    foreignKey: 'id_user',      // Referencia a Usuario.id
    otherKey: 'id_carpeta'      // Referencia a Carpeta.id
});
Carpeta.belongsToMany(Usuario, { 
    through: 'usuario_carpeta', 
    foreignKey: 'id_carpeta', 
    otherKey: 'id_user' 
});

// Relación Recursiva Carpeta - Carpeta
Carpeta.hasMany(Carpeta, { 
    as: 'subcarpetas', 
    foreignKey: 'parentId' 
});
Carpeta.belongsTo(Carpeta, { 
    as: 'padre', 
    foreignKey: 'parentId' 
});

// Relación 1:N Carpeta - Fichero
Carpeta.hasMany(Fichero, { 
    foreignKey: 'id_carpeta' 
});
Fichero.belongsTo(Carpeta, { 
    foreignKey: 'id_carpeta' 
});

// Relación N:N Fichero - Etiqueta
// Se crea tabla 'fichero_etiqueta' con columnas 'id_fichero' e 'id_etiqueta'
Fichero.belongsToMany(Etiqueta, { 
    through: 'fichero_etiqueta', 
    foreignKey: 'id_fichero',   // Referencia a Fichero.id
    otherKey: 'id_etiqueta'     // Referencia a Etiqueta.id
});
Etiqueta.belongsToMany(Fichero, { 
    through: 'fichero_etiqueta', 
    foreignKey: 'id_etiqueta', 
    otherKey: 'id_fichero' 
});

module.exports = {
    Usuario,
    Carpeta,
    Fichero,
    Etiqueta,
    sequelize
};