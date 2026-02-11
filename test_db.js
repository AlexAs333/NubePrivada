require('dotenv').config();
const { Usuario, Carpeta, Fichero, Etiqueta, sequelize } = require('./src/models/index');

async function test() {
    try {
        // 1. Sincronizar (Crea las tablas)
        await sequelize.sync({ force: true }); // 'force: true' borra todo y lo recrea para la prueba
        console.log('--- Tablas creadas ---');

        // 2. Crear un Usuario
        const user = await Usuario.create({
            nombre: 'admin',
            correo: 'admin@nube.com'
        });
        console.log(' Usuario creado:', user.nombre);

        // 3. Crear Carpeta Raíz
        const rootFolder = await Carpeta.create({
            nombre: 'Mis Documentos',
            descripcion: 'Carpeta principal'
        });

        // 4. Crear una Subcarpeta (Recursividad)
        const subFolder = await Carpeta.create({
            nombre: 'Fotos',
            parentId: rootFolder.id // Aquí probamos la recursividad
        });
        console.log(' Subcarpeta creada dentro de:', rootFolder.nombre);

        // 5. Relacionar Usuario con Carpeta (N:N - Tabla usuario_carpeta)
        await user.addCarpeta(rootFolder);
        console.log(' Relación Usuario-Carpeta creada en la tabla intermedia.');

        // 6. Crear un Fichero dentro de la subcarpeta
        const file = await Fichero.create({
            nombre: 'vacaciones.jpg',
            ruta: '/storage/user1/fotos/vacaciones.jpg',
            id_carpeta: subFolder.id
        });
        console.log(' Fichero creado:', file.nombre);

        // 7. Crear Etiqueta y asignarla al Fichero (N:N - Tabla fichero_etiqueta)
        const tag = await Etiqueta.create({ nombre: 'Verano', color: '#FF5733' });
        await file.addEtiqueta(tag);
        console.log(' Etiqueta asignada al fichero.');

        console.log('\n--- PRUEBA COMPLETADA CON ÉXITO ---');
        process.exit(0);

    } catch (error) {
        console.error(' Error en la prueba:', error);
        process.exit(1);
    }
}

test();