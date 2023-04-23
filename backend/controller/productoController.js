const fs = require('fs');
const path =require('path');
const MySQLBD = require("../config/mysql.config");


exports.nuevoProducto = async  (req, res,next) => {

    const ProductoEnviado= req.params.id;
    const conectBD = MySQLBD.conectar();

    if(ProductoEnviado==0){
    
    const {producto} = req.body;   

    conectBD.query(`INSERT INTO Productos(nombre,precio,descripcion,categoriaId,personaId) VALUES
    ('${producto.nombre}',${producto.precio},'${producto.descripcion}',${producto.categoria},${producto.usuarioId})  `, (err, ProductoRes) => {
        
            if(err){
                res.send({mensaje:'Error al insertar producto',exito:0});
                
            }else{

                res.send({mensaje:'Su producto se ha registrado',productoId:ProductoRes.insertId,exito:1});
               
            }
            console.log("Close Connection");
            conectBD.end(); 
      });
   }else{
 
    const imagenes = req.files;
    var mensaje ='Su producto se ha registrado ';
    var imerr = 1;
  
   
   imagenes.forEach(imagen => {
    
        const img=  fs.readFileSync(path.join( __dirname,'..','public','uploads',imagen.filename));

    
    
    let imgQuery ="INSERT INTO ImagenesProducto(productoId,productoImagen,contentType) VALUES (?,?,?)";
     let query = MySQLBD.mysql.format(imgQuery,[ProductoEnviado,img,imagen.mimetype]);
     setTimeout( () => {
    
     conectBD.query(query,(err, ImagenRes)=>{
        if(err) {
        
        mensaje=mensaje +', Error al guardar imagen '+ imerr;
    }
        console.log('save');
        
        
        if(imagenes.length == imerr){

            res.send({mensaje,exito:1});
            console.log("Close Connection");
            conectBD.end(); 
        }
        imerr+=1;
    });
    
    fs.unlinkSync((path.join( __dirname,'..','public','uploads',imagen.filename)));
    }, 5)



    });
    
 
  
    
   }


};


exports.getAll_categorias = async (req, res) => {
    
    const conectBD = MySQLBD.conectar();
    //BUSCAR CATEGORIAS
    conectBD.query(`SELECT * FROM Categorias`, (err, CategoriasRes) => {
        
        if(err){
            res.send({mensaje:'Error al optener categorias',exito:0});
            console.log("Close Connection");
            conectBD.end();
        }else{
         

                res.send({mensaje:'Categorias obtenidas',categorias:CategoriasRes,exito:1});

            console.log("Close Connection");
            conectBD.end();
     
        }
    });
        
};

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

exports.getProductosCategoria = async (req,res) =>{

    const categoriaId = req.params.id;

    const conectBD = MySQLBD.conectar();

    conectBD.query(`SELECT p.*,i.productoImagen Imagen ,i.contentType ImagenTipo,CONCAT(u.nombre,' ',u.apellido) Usuario , c.nombre Categoria, c.Id CategoriaId FROM Productos p 
    INNER JOIN ImagenesProducto i ON p.Id = i.productoId
    INNER JOIN Categorias c ON c.Id = p.categoriaId
    INNER JOIN Usuarios u ON u.Id = p.personaId  
    AND p.categoriaId = ${categoriaId} AND p.estadoHabilitacion = TRUE
    GROUP BY p.Id`, (err, ProductoRes) => {
        
        if(err){
            res.send({mensaje:`Error al buscar productos ${categoriaId}`,exito:0})
        }else{
            if(ProductoRes.length){
            res.send({mensaje:'Productos encontrados',productos:ProductoRes,categoria:{id:ProductoRes[0].CategoriaId,nombre:ProductoRes[0].Categoria},exito:1})
            }else{
            res.send({mensaje:'No hay Productos en esta categoria',exito:0})  
            }
        }
       
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

exports.getProductosUsuario = async (req,res) =>{

    const usuarioId = req.params.id;

    const conectBD = MySQLBD.conectar();

    conectBD.query(`SELECT p.*,i.productoImagen Imagen ,i.contentType ImagenTipo,u.nombre Usuario, u.Id UsuarioId, c.nombre Categoria, c.Id CategoriaId FROM Productos p 
    INNER JOIN ImagenesProducto i ON p.Id = i.productoId
    INNER JOIN Categorias c ON c.Id = p.categoriaId
	INNER JOIN Usuarios u ON u.Id = p.personaId  
	AND p.personaId = ${usuarioId} AND p.estadoHabilitacion = TRUE 
    GROUP BY p.Id
    ORDER BY p.creacion DESC`, (err, ProductoRes) => {

        if(err){
            res.send({mensaje:'Error al buscar productos',exito:0})
        }else{
            if(ProductoRes.length){
            res.send({mensaje:'Productos encontrados',productos:ProductoRes,usuario:{id:ProductoRes[0].UsuarioId,nombre:ProductoRes[0].Usuario},exito:1})
            }else{
            res.send({mensaje:'Este usuario no ha agreagdo productos',exito:0})  
            }
        }
       
        console.log("Close Connection");
        conectBD.end(); 
    });

};

exports.borrarProducto = async (req,res) =>{

    const productoId = req.params.id;
    

    const conectBD = MySQLBD.conectar();

    conectBD.query(`SELECT * FROM Productos WHERE Id = ${productoId} AND estadoHabilitacion = TRUE `, (err, ProductoRes) => {

        if(err){
            res.send({mensaje:'Error al buscar producto',exito:0});
            console.log("Close Connection");
            conectBD.end(); 
        }else{
            if(ProductoRes.length){
                
                conectBD.query(`DELETE FROM ImagenesProducto WHERE productoId = ${productoId}`, (err, ImagenRes) => {
        
                    if(err){
                        res.send({mensaje:'Error al borrar imagenes del producto',exito:0});
                        console.log("Close Connection");
                        conectBD.end(); 
                    }else{
                        conectBD.query(`DELETE FROM Productos WHERE Id = ${productoId}`, (err,  ProductoRes) => {
                            if(err){
                                res.send({mensaje:'Error al borrarProducto',exito:0});
                                console.log("Close Connection");
                                conectBD.end(); 
                            }
                            else{
                                res.send({mensaje:'Producto eliminado',exito:1})
                                console.log("Close Connection");
                                conectBD.end();    
                            }
                        });
                    }
                });    
            }else{
                res.send({mensaje:'No existe el producto',exito:0})
                console.log("Close Connection");
                conectBD.end();   
            }
        }
    });

};

