import { sequelize } from '../config/database.js';
import { Producto } from '../models/Producto.js';

/**
 * Script de referencia para probar operaciones CRUD básicas sobre el modelo Producto.
 * Se puede ejecutar con: `node ./src/scripts/productoCrudDemo.js`
 */
async function runCrudDemo() {
    try {
        await sequelize.authenticate();
        // Garantiza que la tabla respete la definición actual del modelo (sin timestamps).
        await sequelize.sync({ alter: true });

        // Limpia residuos de ejecuciones previas del script.
        await Producto.destroy({ where: { categoria: 'DEMO_SCRIPT' } });
        console.log('Limpieza previa completada (categoria = DEMO_SCRIPT).');

        const primerProducto = await Producto.create({
            nombre: 'Mate Imperial Demo',
            descripcion: 'Producto creado desde el script de pruebas.',
            precio: 15000,
            categoria: 'DEMO_SCRIPT',
            imagen: 'mate-imperial-demo.jpg',
            activo: true,
        });

        const segundoProducto = await Producto.create({
            nombre: 'Bombilla Alpaca Demo',
            descripcion: 'Segundo producto para demostrar acciones de update/delete.',
            precio: 6000,
            categoria: 'DEMO_SCRIPT',
            imagen: 'bombilla-demo.jpg',
            activo: true,
        });

        console.log('\nProductos insertados:');
        console.table([
            primerProducto.get({ plain: true }),
            segundoProducto.get({ plain: true }),
        ]);

        await Producto.update(
            { precio: 17500 },
            { where: { id: primerProducto.id } },
        );

        const productoActualizado = await Producto.findByPk(primerProducto.id, {
            raw: true,
        });

        console.log('\nProducto actualizado (Mate Imperial Demo):');
        console.table([productoActualizado]);

        // const eliminados = await Producto.destroy({
        //     where: { id: segundoProducto.id },
        // });

        // console.log(
        //     `\nProducto eliminado (Bombilla Alpaca Demo): ${eliminados === 1 ? 'OK' : 'No encontrado'}`,
        // );

        const restantes = await Producto.findAll({
            where: { categoria: 'DEMO_SCRIPT' },
            raw: true,
        });

        console.log('\nProductos con categoria DEMO_SCRIPT luego de las operaciones:');
        console.table(restantes);

        console.log('\nFin del script. Puedes volver a ejecutarlo para repetir la prueba.');
    } catch (error) {
        console.error('Fallo en el script de pruebas:', error);
    } finally {
        await sequelize.close();
    }
}

runCrudDemo();
