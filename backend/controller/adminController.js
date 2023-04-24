const MySQLBD = require("../config/mysql.config");
const bcrypt = require('bcrypt');


exports.getProductosAdmin = async (req,res) =>{
    //conexión a base de datos
    const connectBD = MySQLBD.conectar();
    //Consulta a todos los productos registrados
    connectBD.query(`SELECT p.*, CONCAT(u.nombre,' ',u.apellido) Usuario , c.nombre Categoria, c.Id CategoriaId FROM Productos p 
    INNER JOIN Categorias c ON c.Id = p.categoriaId
    INNER JOIN Usuarios u ON u.Id = p.personaId  
    AND p.estadoHabilitacion = TRUE
    GROUP BY p.Id`, (err, ProductoRes) => {
    if(err){ 
        res.send({mensaje:'Error al buscar productos',exito:0});
    }else{
        //devuelve lista de productos
        res.send({mensaje:'Productos encontrados',productos:ProductoRes,exito:1}); 
    }
        //Cerrando conexión a base de datos
        console.log("Close Connection");
        connectBD.end(); 
    });
};

exports.getUsuarios = async (req, res) => {
    //conexión a base de datos
    const connectBD = MySQLBD.conectar();
    //consulta a todos los usuarios registrados
    connectBD.query('SELECT u.*, m.departamentoId, t.telefono FROM Usuarios u INNER JOIN Municipios m ON u.municipioId = m.Id INNER JOIN Telefonos t ON u.Id = t.personaId', (err, UsuarioRes) =>{
        if(err){
            res.send({mensaje:'Error al buscar usuarios', exito:0});
        }else{
            //devuelve lista de usuarios registrados
            res.send({mensaje:'Usuarios encontrados', usuarios:UsuarioRes, exito:1});
        }
        //Cerrando conexión a la base de datos
        console.log("Close Connection");
        connectBD.end();
    });
}

exports.actualizarProducto = async  (req, res) => {
    //conexión a base de datos
    const connectBD = MySQLBD.conectar();
    const producto = req.body;  
    //console.log(producto) 
    //Actualizando producto con nuevos parametros
    connectBD.query(`UPDATE Productos SET nombre="${producto.nombre}", precio=${producto.precio}, descripcion="${producto.descripcion}", categoriaId=${producto.categoria} WHERE Id=${producto.productoId}`, (err, ProductoRes) => {
            if(err){
                res.send({mensaje:'Error al actualizar producto',exito:0});
                //console.log(err);
            }else{
                res.send({mensaje:'Producto actualizado',exito:1});
            }
            console.log("Close Connection");
            connectBD.end(); 
      });
};

exports.registrarUsuarioAdmin = async (req, res) => {
    //CAPTURA DE DATOS
    const {nombre,apellido,email,passw,municipio,telefono,direccion} = req.body;
    // INICIAR CONEXION A BASE DE DATOS
    const connectBD = MySQLBD.conectar();
    connectBD.query(`SELECT * FROM Usuarios WHERE email = '${email}'`, (err, oldUser) => {
        //Comprobar si usuario ya esta registrado
        if (!oldUser.length) {
            //Si es un usuario nuevo, agregar a base de datos y recuperar id
            connectBD.query(`INSERT INTO Usuarios (nombre,apellido,email,municipioId,direccion) VALUES ('${nombre}','${apellido}','${email}',${municipio},'${direccion}')`, (err, UsuarioRes) => {
                if (err) {
                    res.send({mensaje:'Error al insertar el usuario',guardado:0});
                    console.log("Close Connection");
                    connectBD.end();
                }else{
                    //Guardar telefono
                    connectBD.query(`INSERT INTO Telefonos(personaId,telefono) VALUES (${UsuarioRes.insertId},'${telefono}')`, (err, TelefonoRes) => {
                        if (err) {
                            res.send({mensaje:'Error al insertar el telefono',guardado:0});
                            insercionFallida({paso:1,id:UsuarioRes.insertId});
                            console.log("Close Connection");
                            connectBD.end();
                        }else{
                            //Encriptación de contraseña
                            bcrypt.hash(passw, 8, (err, hashedPassword) => {
                                if (err) {
                                    res.send({mensaje:'Error al encriptar contraseña',guardado:0});
                                    insercionFallida({paso:2,id:UsuarioRes.insertId});
                                    console.log("Close Connection");
                                    conectBD.end();
                                }
                                else {
                                //Guardar contraseña
                                connectBD.query(`INSERT INTO DatosInicioSesion(personaId,contrasenia) VALUES (${UsuarioRes.insertId},'${hashedPassword}')`, (err, ContraseniaRes) => {
                                    if (err) {
                                        res.send({mensaje:'Error al guardar datos de session',guardado:0});
                                        insercionFallida({paso:3,id:UsuarioRes.insertId});
                                        console.log("Close Connection");
                                        connectBD.end();
                                    }else {
                                        connectBD.query(`UPDATE Usuarios SET estadoHabilitacion = TRUE WHERE email = '${email}'`, (err, result) => {
                                            if(err){
                                                res.send({mensaje:'Usuario insertado, error al activar',guardado:1});
                                            }else{
                                                res.send({mensaje:'Usuario insertado',guardado:1});
                                            }
                                            console.log("Close Connection");
                                            connectBD.end();
                                        })
                                    }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.send({mensaje:'El usuario con el correo <' + oldUser[0].email+'> ya existe',guardado:0});
            console.log("Close Connection");
            connectBD.end();
        }
    });
};

exports.actualizarUsuario = async  (req, res) => {
    //conexión a base de datos
    const connectBD = MySQLBD.conectar();
    const usuario = req.body;  
    //console.log(usuario) 
    //Actualizando usuario con nuevos parametros
    connectBD.query(`UPDATE Usuarios SET nombre="${usuario.nombre}", apellido="${usuario.apellido}", email="${usuario.email}", municipioId=${usuario.municipio}, direccion="${usuario.direccion}" WHERE Id=${usuario.id}`, (err, UsuarioRes) => {
            if(err){
                res.send({mensaje:'Error al actualizar usuario',exito:0});
                console.log("Close Connection");
                connectBD.end();
            }else{
                connectBD.query(`UPDATE Telefonos SET telefono = "${usuario.telefono}" WHERE personaId = ${usuario.id}`, (err, TelefonoRes) => {
                    if(err){
                        //console.log(err)
                        res.send({mensaje:'Error al actualizar telefono',exito:0});  
                    }else{
                        res.send({mensaje:'Usuario actualizado',exito:1});
                    }
                    console.log("Close Connection");
                    connectBD.end(); 
                });
            } 
      });
};

exports.borrarUsuario = async (req,res) =>{
    //obteniendo id de usuario a eliminar
    const usuarioId = req.params.id;
    //conectando a la base de datos
    const connectBD = MySQLBD.conectar();
    //verificando que el usuario exista
    connectBD.query(`SELECT * FROM Usuarios WHERE Id = ${usuarioId}`, (err, UsuarioRes) => {
        if(err){
            res.send({mensaje:'Error al buscar usuario',exito:0});
            console.log("Close Connection");
            connectBD.end(); 
        }else{
            //si el usuario existe, borrando credenciales de inicio de sesión
            if(UsuarioRes.length){
                connectBD.query(`DELETE FROM DatosInicioSesion WHERE personaId = ${usuarioId}`, (err, DatosRes) => {
                    if(err){
                        res.send({mensaje:'Error al borrar datos de inicio de sesión',exito:0});
                        console.log("Close Connection");
                        connectBD.end(); 
                    }else{
                        //eliminando usuario de la base de datos
                        connectBD.query(`DELETE FROM Usuarios WHERE Id = ${usuarioId}`, (err,  UsuarioRes) => {
                            if(err){
                                res.send({mensaje:'Error al borrar Usuario',exito:0});
                                console.log("Close Connection");
                                connectBD.end(); 
                            }
                            else{
                                res.send({mensaje:'Usuario eliminado',exito:1})
                                console.log("Close Connection");
                                connectBD.end();    
                            }
                        });
                    }
                });    
            }else{
                res.send({mensaje:'El usuario no existe',exito:0})
                console.log("Close Connection");
                connectBD.end();   
            }
        }
    });
};

//Si ocurre un error durante la insersión de usuario, se borraran los datos insertados en pasos anteriores
function insercionFallida(dato){
    console.log('Borrando datos de registro fallido');
    const connectBD = MySQLBD.conectar();
    if(dato.paso == 1){
        //Si se completo el paso 1 antes de fallar, se borraran datos de la tabla Usuarios
        connectBD.query(`DELETE FROM Usuarios WHERE Id = ${dato.id}`, (err, resultado) => { 
        if(err){
            console.log({mensaje:'Error al eliminar usuario mal insertado'})
        }
    }); 
}
    if(dato.paso == 2 || dato.paso ==3){
        //Si se completo el paso 2 o 3 tambien se borraran los datos de la tabla Telefonos
        connectBD.query(`DELETE FROM Telefonos WHERE personaId = ${dato.id}`, (err, resultado) => { 
            if(err){
                console.log({mensaje:'Error al eliminar telefono mal insertado'})
            }
            else{
                //borrando datos de tabla Usuarios
                connectBD.query(`DELETE FROM Usuarios WHERE Id= ${dato.id}`, (err, resultado) => { 
                    if(err){
                        console.log({mensaje:'Error al eliminar usuario mal insertado'})
                    }
                });
            }
        });
    
    }
    console.log("Close Connection");
    connectBD.end();
 };