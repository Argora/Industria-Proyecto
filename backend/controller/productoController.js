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

exports.getProductoDetalle = async (req,res) =>{

    const productoId = req.params.id;

    const conectBD = MySQLBD.conectar();

    conectBD.query(`SELECT p.*,i.productoImagen Imagen ,i.contentType ImagenTipo,CONCAT(u.nombre,' ',u.apellido) Usuario, u.Id UsuarioId, c.nombre Categoria, c.Id CategoriaId FROM Productos p 
    INNER JOIN ImagenesProducto i ON p.Id = i.productoId
    INNER JOIN Categorias c ON c.Id = p.categoriaId
	INNER JOIN Usuarios u ON u.Id = p.personaId  
	AND p.Id = ${productoId} AND p.estadoHabilitacion = TRUE 
    GROUP BY p.Id
    ORDER BY p.creacion DESC`, (err, ProductoRes) => {


        
        if(err){
            res.send({mensaje:'Error al buscar productos',exito:0});
            console.log("Close Connection");
            conectBD.end(); 
        }else{
            if(ProductoRes.length){
                conectBD.query(` SELECT Id,productoImagen Imagen,contentType ImagenTipo FROM ImagenesProducto WHERE productoId =  ${productoId} `, (err, ImagenRes) => {
                    
                    if(err){res.send({mensaje:'Error al buscar imagenes del producto',exito:0});}
                    else{
                    res.send({mensaje:'Productos encontrados',producto:ProductoRes,imagenes:ImagenRes,exito:1})
                     /*Prueba 
                     res.render('img.html',{ 

                         pds:[],
                         items:ImagenRes });
                     /* Prueba */
                }

                });
            }else{
            res.send({mensaje:'No existe el producto',exito:0})  
            }
            console.log("Close Connection");
            conectBD.end(); 
        }
       
      
    });

};