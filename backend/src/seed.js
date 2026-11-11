const { sequelize, Carpeta, Fichero } = require('./models/index');

async function seed() {
    // Sincroniza y limpia la base de datos
    await sequelize.sync({ force: true }); 
    
    // Crear carpetas
    const root = await Carpeta.create({ nombre: 'Raíz', descripcion: 'Directorio principal' });
    const docs = await Carpeta.create({ nombre: 'Documentos', parentId: root.id });
    const imgs = await Carpeta.create({ nombre: 'Imágenes', parentId: root.id });
    
    // Crear ficheros
    await Fichero.create({ nombre: 'presupuesto.pdf', ruta: '/docs/presupuesto.pdf', id_carpeta: docs.id });
    await Fichero.create({ nombre: 'vacaciones.jpg', ruta: '/imgs/vacaciones.jpg', id_carpeta: imgs.id });
    
    console.log('Datos de prueba insertados correctamente.');
    process.exit();
}

seed();