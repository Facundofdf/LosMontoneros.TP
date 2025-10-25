const Producto = require("../models/producto");

const getController = async (request, response) => {
    const productos = (await Producto.obtenerTodos());

    response.render("listado_productos", {titulo: "Listado de usuarios", prod_obj_array: productos});
}

const postController = async (request, response)=>{
    let estado = 200;
    const obj_resp = {"exito" : false, "mensaje" : "No se pudo agregar."};
    const producto = { ...request.body };

    if(await Producto.agregar(producto)){
        estado = 201;
        obj_resp.exito = true;
        obj_resp.mensaje = "Producto agregado con exito."
    }

    response.status(estado).json(obj_resp);
}

const putController = async (request, response)=>{
    let estado = 404;
    const obj_resp = {"exito" : false, "mensaje" : "No se pudo modificar."};
    const producto = { ...request.body };

    if(await Producto.modificar(producto)){
        estado = 200;
        obj_resp.exito = true;
        obj_resp.mensaje = "Producto modificado con exito."
    }

    response.status(estado).json(obj_resp);
}

const deleteController = async (request, response)=>{
    let estado = 404;
    const obj_resp = {"exito" : false, "mensaje" : "No se pudo eliminar."};
    const producto = { ...request.body };

    if(await Producto.eliminar(producto)){
        estado = 200;
        obj_resp.exito = true;
        obj_resp.mensaje = "Producto eliminado con exito."
    }
    
    response.status(estado).json(obj_resp);
}

module.exports = {getController, postController, putController, deleteController};