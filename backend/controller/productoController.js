const MySQLBD = require("../config/mysql.config");

exports.getProductos = async (req,res) =>{
    const conectBD = MySQLBD.conectar();

    conectBD.query(`SELECT p.*,i.productoImagen Imagen ,i.contentType ImagenTipo,CONCAT(u.nombre,' ',u.apellido) Usuario , c.nombre Categoria, c.Id CategoriaId FROM Productos p 
    INNER JOIN ImagenesProducto i ON p.Id = i.productoId
    INNER JOIN Categorias c ON c.Id = p.categoriaId
    INNER JOIN Usuarios u ON u.Id = p.personaId  
    AND p.estadoHabilitacion = TRUE
    GROUP BY p.Id`, (err, ProductoRes) => {


    if(err){ res.send({mensaje:'Error al buscar productos',exito:0})}
    else{res.send({mensaje:'Productos encontrados',productos:ProductoRes,exito:1}) }

 
        console.log("Close Connection");
        conectBD.end(); 
    });

};