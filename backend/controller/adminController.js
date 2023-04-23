const MySQLBD = require("../config/mysql.config");


exports.getProductosAdmin = async (req,res) =>{
    //conexión a base de datos
    const conectBD = MySQLBD.conectar();
    //Consulta a todos los productos registrados
    conectBD.query(`SELECT p.*, CONCAT(u.nombre,' ',u.apellido) Usuario , c.nombre Categoria, c.Id CategoriaId FROM Productos p 
    INNER JOIN Categorias c ON c.Id = p.categoriaId
    INNER JOIN Usuarios u ON u.Id = p.personaId  
    AND p.estadoHabilitacion = TRUE
    GROUP BY p.Id`, (err, ProductoRes) => {
    if(err){ 
        res.send({mensaje:'Error al buscar productos',exito:0})
    }else{
        //devuelve lista de productos
        res.send({mensaje:'Productos encontrados',productos:ProductoRes,exito:1}) 
    }
        //Cerrando conexión a base de datos
        console.log("Close Connection");
        conectBD.end(); 
    });

};

exports.actualizarProducto = async  (req, res) => {
    //conexión a base de datos
    const conectBD = MySQLBD.conectar();
    const producto = req.body;  
    //console.log(producto) 
    //Actualizando producto con nuevos parametros
    conectBD.query(`UPDATE Productos SET nombre="${producto.nombre}", precio=${producto.precio}, descripcion="${producto.descripcion}", categoriaId=${producto.categoria} WHERE Id=${producto.productoId}`, (err, ProductoRes) => {
            if(err){
                res.send({mensaje:'Error al actualizar producto',exito:0});
                //console.log(err);
            }else{
                res.send({mensaje:'Producto actualizado',productoId:ProductoRes.insertId,exito:1});
            }
            console.log("Close Connection");
            conectBD.end(); 
      });
};