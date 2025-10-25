const PATH_ARCHIVO = "./archivos/productos.json";
const fs = require('fs');

class Producto {

    static async obtenerTodos(){
        let retorno = {};
        if(fs.existsSync(PATH_ARCHIVO)){
            const data = fs.readFileSync(PATH_ARCHIVO);
            retorno = JSON.parse(data);
        }

        return retorno;
    }

    static async agregar(obj_producto){
        let retorno = false;
        
        if(fs.existsSync(PATH_ARCHIVO)){
            const data = fs.readFileSync(PATH_ARCHIVO);
            const productos = JSON.parse(data);
            productos.push(obj_producto);
            fs.writeFileSync(PATH_ARCHIVO, JSON.stringify(productos, null, 2));
            retorno = true;
            }
        
        return retorno;
    }

    static async modificar(obj_producto){
        let retorno = false;
        
        if(fs.existsSync(PATH_ARCHIVO)){
            const data = fs.readFileSync(PATH_ARCHIVO);
            const productos = JSON.parse(data);
            const indice = productos.findIndex(p => parseInt(p.codigo) === parseInt(obj_producto.codigo))
        
            if(indice !== -1){
                productos[indice] = obj_producto;
                fs.writeFileSync(PATH_ARCHIVO, JSON.stringify(productos, null, 2));
                retorno = true;
            }
        }
        return retorno;
    }

    static async eliminar(obj_producto){
        let retorno = false;
        
        if(fs.existsSync(PATH_ARCHIVO)){
            const data = fs.readFileSync(PATH_ARCHIVO);
            const productos = JSON.parse(data);
            const indice = productos.findIndex(p => parseInt(p.codigo) === parseInt(obj_producto.codigo))
        
            if(indice !== -1){
                const productos_delete = productos.filter(p =>  parseInt(p.codigo) !== parseInt(obj_producto.codigo))
                fs.writeFileSync(PATH_ARCHIVO, JSON.stringify(productos_delete, null, 2));
                retorno = true;
            }
        }
        return retorno;
    }
}

module.exports = Producto;