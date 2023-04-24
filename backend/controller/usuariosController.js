const fs = require('fs');
const path =require('path');
const bcrypt = require('bcrypt');
const MySQLBD = require("../config/mysql.config");
const {getVerifyTemplate, sendEmailVerify} = require('../config/correo.config');
const {getTokenEmail, getTokenLogIn, getTokenData, getTokenDataExpired} = require('../config/token.config');

exports.getDeptosMunicipios = async (req, res) => {
    
    const conectBD = MySQLBD.conectar();
    //Obtener departamentos
    conectBD.query(`SELECT * FROM Departamentos`, (err, DepartamentosRes) => {
        
        if(err){
            res.send('Error al optener departamentos');
            console.log("Close Connection");
            conectBD.end();
        }else{
    //Obtener municipios
        conectBD.query(`SELECT * FROM Municipios`, (err, MunicipiosRes) => {

            if(err){
                res.send('Error al optener municipios');
                
            }else{

                res.send({departamentos:DepartamentosRes,municipios:MunicipiosRes});

            }

            console.log("Close Connection");
            conectBD.end();
        });
        }
    });
        
};

exports.registrarUsuario = async (req, res) => {

    //CAPTURA DE DATOS,saque municipio
    const {nombre,apellido,email,passw,municipio,telefono,direccion, suscripcion, endpoint} = req.body;
    
     // INICIAR CONEXION
    const conectBD = MySQLBD.conectar();
        //CONSULTA
    
    conectBD.query(`SELECT * FROM Usuarios WHERE email = '${email}'`, (err, oldUser) => {
        //Comprobar si usuario ya esta registrado
        if (!oldUser.length) {

            //Si es un usuario nuevo, agregar a base de datos y recuperar id
            conectBD.query(`INSERT INTO Usuarios (nombre,apellido,email,municipioId,direccion) VALUES ('${nombre}','${apellido}','${email}',${municipio},'${direccion}')`, (err, UsuarioRes) => {
                if (err) {
                    res.send({mensaje:'Error al insertar el usuario',guardado:0});
                    console.log("Close Connection");
                    conectBD.end();
                }else{
               
                    //Guardar telefono
                    conectBD.query(`INSERT INTO Telefonos(personaId,telefono) VALUES (${UsuarioRes.insertId},'${telefono}')`, (err, TelefonoRes) => {
                        
                        if (err) {
                            res.send({mensaje:'Error al insertar el telefono',guardado:0});
                            insercionFallida({paso:1,id:UsuarioRes.insertId});
                            console.log("Close Connection");
                            conectBD.end();
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
                                conectBD.query(`INSERT INTO DatosInicioSesion(personaId,contrasenia) VALUES (${UsuarioRes.insertId},'${hashedPassword}')`, (err, ContraseniaRes) => {
                                    if (err) {
                                        res.send({mensaje:'Error al guardar datos de session',guardado:0});
                                        insercionFallida({paso:3,id:UsuarioRes.insertId});
                                        console.log("Close Connection");
                                        conectBD.end();
                                    }else {
                                            conectBD.query(`INSERT INTO Suscripciones(clienteId, estado, tipoSuscripcion, endpoint) VALUES (${UsuarioRes.insertId}, 1, ${suscripcion}, '${endpoint}')`, (err) => {
                                                if (err) {
                                                    res.send({mensaje:'Error al guardar la suscripcion',guardado:0});
                                                }else {
                                                    res.send({mensaje:'Suscripcion insertada',guardado:1});
                                                }
                                            })
                                            console.log("Close Connection");
                                            conectBD.end();
                                            //Generando token de identificación para correo
                                            const token = getTokenEmail(email);
                                            //Cargando template de correo de confirmación
                                            const template = getVerifyTemplate(nombre+' '+apellido,token);
                                            //Enviando correo de confirmación
                                            sendEmailVerify(email,'Confirmar Cuenta',template);
                                            res.send({mensaje:'Usuario insertado',guardado:1});
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
            conectBD.end();
        }
    });
};

exports.confirmarUsuario = async (req, res) => {    
    //Obtener token verificación
    const {token} = req.body;
    //Verificar token
    const data = getTokenData(token);
    if(!data){
       res.send({mensaje:'Error en data token'});
       console.log("Error en data token");
    }else{
        //Extraer email del usuario
        const email = data.data;
        //conexión a base de datos
        const conectBD = MySQLBD.conectar();
        //Consultar usuario en base de datos
        conectBD.query(`SELECT * FROM Usuarios WHERE email = '${email}'`, (err, User) => {
           //Verificar si el usuario
           if (!User.length) {
                res.send({mensaje:'Usuario no existe'});
                console.log("Close Connection");
                conectBD.end();
            }else{
                //Habilitar usuario en base de datos
                conectBD.query(`UPDATE Usuarios SET estadoHabilitacion = TRUE WHERE email = '${User[0].email}'`, (err, result) => {
                    if(err){
                        res.send({mensaje:'Error al habilitar usuario'});
                    }
                    else{
                        res.send({mensaje:'Usuario habilitado'});
                    };
                    console.log("Close Connection");
                    conectBD.end();
                });
            }
        });
    }
};

exports.LoginUsuario = async (req, res) => {
    const {email,contrasenia} = req.body;
    const conectBD = MySQLBD.conectar();
    //Buscar usuario en base de datos
    conectBD.query(`SELECT * FROM Usuarios WHERE email = '${email}' AND estadoHabilitacion = TRUE `, (err, UsuarioRes) => {
        //Verificar si el usuario existe y esta habilitado
        if (!UsuarioRes.length) {
            res.send({"mensaje":"Usuario No existe O se encuentra deshabilitado",acceso:0});
            console.log("Close Connection");
            conectBD.end();
        } else {
            //Si el usuario existe y esta habilitado, extraer contraseña
            conectBD.query(`SELECT * FROM DatosInicioSesion WHERE personaId = ${UsuarioRes[0].Id } AND estado = TRUE`, (err, ContraseniaRes) => {
                //Comparar contraseña ingresada con la contraseña encriptada en la base de datos
                bcrypt.compare(contrasenia, ContraseniaRes[0].contrasenia, (err, result) => {
                    if (result) {
                        //Si existe el usuario, se crea token de autorización para inicio de sesión
                        if(UsuarioRes[0].estadoHabilitacion){
                            const user = {
                                "id":UsuarioRes[0].Id,
                                "tipoUsuario":UsuarioRes[0].TipoUsuario
                            }
                            const token = getTokenLogIn(user);
                            res.send({"mensaje":"contraseña correcta","usuario":UsuarioRes[0],token,acceso:1},);
                        }else{
                            res.send({"mensaje":"El usuario no ha confirmado su cuenta",acceso:0},); 
                        }
                    }else {
                        res.send({"mensaje":"contraseña incorrecta",acceso:0});
                    };
                    console.log("Close Connection");
                    conectBD.end();
                });
            
            });
        }
    });
};

exports.perfilUsuario = async (req, res) => {

    const id = req.params.id;

    const conectBD = MySQLBD.conectar();
    //BUSCAR USUARIO
    conectBD.query(`SELECT u.*, t.telefono, d.nombre AS departamento FROM Usuarios u 
    INNER JOIN Telefonos t ON u.Id = t.personaId 
    INNER JOIN Municipios m ON u.municipioId = m.Id 
    INNER JOIN Departamentos d ON m.departamentoId = d.Id 
    WHERE u.Id = '${id}' AND u.estadoHabilitacion = TRUE; `, (err, UsuarioRes) => {
      
        //REVISAR SI SE ENCONTRO EL USUARIO
        if (!UsuarioRes.length) {

            res.send({"mensaje":"Usuario No existe O se encuentra deshabilitado",exito:0});
            console.log("Close Connection");
            conectBD.end();

        } else {

            if(UsuarioRes[0].estadoHabilitacion){
                res.send({"mensaje":"Usuario encontrado","usuario":UsuarioRes[0],exito:1},);
            }else{
                res.send({"mensaje":"El usuario no ha confirmado su cuenta",exito:0},); 
            }
            console.log("Close Connection");
            conectBD.end();
        }
    });
};

exports.detallesVendedor = async (req, res) => {

    const id = req.params.id;

    const conectBD = MySQLBD.conectar();
    //BUSCAR USUARIO
    conectBD.query(`SELECT CONCAT(u.nombre,' ',u.apellido) nombre, u.estadoHabilitacion, d.nombre AS departamento FROM Usuarios u 
    INNER JOIN Municipios m ON u.municipioId = m.Id 
    INNER JOIN Departamentos d ON m.departamentoId = d.Id 
    WHERE u.Id = '${id}' AND u.estadoHabilitacion = TRUE; `, (err, UsuarioRes) => {
      
        //REVISAR SI SE ENCONTRO EL USUARIO
        if (!UsuarioRes.length) {

            res.send({"mensaje":"Usuario No existe O se encuentra deshabilitado",exito:0});
            console.log("Close Connection");
            conectBD.end();

        } else {

            if(UsuarioRes[0].estadoHabilitacion){
                res.send({"mensaje":"Usuario encontrado","usuario":UsuarioRes[0],exito:1},);
            }else{
                res.send({"mensaje":"El usuario no ha confirmado su cuenta",exito:0},); 
            }
            console.log("Close Connection");
            conectBD.end();
        }
    });
};

exports.suscripcionesCliente = async (req,res)=>{

    const clienteId = req.params.id;

    const conectBD = MySQLBD.conectar();
    conectBD.query(`SELECT c.nombre,s.* FROM Suscripciones s
                    INNER JOIN Categorias c ON c.Id = s.categoriaId 
                    AND s.clienteId = ${clienteId}
                    AND s.estado = TRUE`, (err, SuscripcionRes) => {

        if(err){
            res.send({mensaje:'Error al buscar suscripciones',exito:0});
            }else{

                if(SuscripcionRes.length){
                res.send({mensaje:'Suscripciones Encontradas',suscripciones:SuscripcionRes,exito:1});
                }
                else{
                    res.send({mensaje:'No existen suscripciones',exito:0});
                }
            }
    
            console.log("Close Connection");
            conectBD.end();
    });
};

exports.suscribirCategoria = async (req,res)=>{

    const {clienteId,categoriaId} = req.body; 

    const conectBD = MySQLBD.conectar();

    conectBD.query(`SELECT * FROM Suscripciones WHERE clienteId = ${clienteId} AND categoriaId = ${categoriaId}`, (err, SuscritoRes) => {
       
        if(err){  res.send({mensaje:'Error al suscribirse a la categoria',exito:0});
                console.log("Close Connection");
                conectBD.end();}
        else{
           
            if(SuscritoRes.length && SuscritoRes[0].estado)
            {
                
                res.send({mensaje:'Ya se encuentra suscrito a esta categoria',exito:0});
                console.log("Close Connection");
                conectBD.end();
            }
            
            else{
            let query =`INSERT INTO Suscripciones(clienteId,categoriaId) VALUES (${clienteId},${categoriaId});`;

            if(SuscritoRes.length){
                
                query=`UPDATE Suscripciones SET estado = TRUE  WHERE clienteId =${clienteId} AND categoriaId = ${categoriaId}`;
            }
      
            conectBD.query(query, (err, SuscripcionRes) => {

                if(err){
                res.send({mensaje:'Error al suscribirse a la categoria',exito:0});
                }else{
                    res.send({mensaje:'Se ha suscrito a la categoria',exito:1});
                }
        
                console.log("Close Connection");
                conectBD.end();
            });

        }}

    });

    
};

exports.cancelarSuscripcion = async (req,res)=>{

    const conectBD = MySQLBD.conectar();
    const {clienteId,categoriaId} = req.body; 

     conectBD.query(`SELECT * FROM Suscripciones WHERE clienteId = ${clienteId} AND categoriaId = ${categoriaId} AND estado = TRUE `, (err, SuscritoRes) => {
       
        if(err){  res.send({mensaje:'Error al cancelar suscripcion',exito:0});
                console.log("Close Connection");
                conectBD.end();}
        else{

            if(SuscritoRes.length){
                
                conectBD.query(`UPDATE Suscripciones SET estado = FALSE  WHERE clienteId =${clienteId} AND categoriaId = ${categoriaId} `, (err, SuscripcionRes) => {

                    if(err){
                    res.send({mensaje:'Error al cancelar suscripcion ',exito:0});
                    }else{
                        res.send({mensaje:'Suscripcion cancelada',exito:1});
                    }
            
                    console.log("Close Connection");
                    conectBD.end();
                });
               
            }else
            {
                res.send({mensaje:'No existe la suscripcion',exito:0});
                console.log("Close Connection");
                conectBD.end();  
            }

        }

    });
};

exports.agregarFavorito = async (req,res)=>{
    const {clienteId,productoId} = req.body;

    const conectBD = MySQLBD.conectar();
    conectBD.query(`INSERT INTO ListaDeseos(clienteId,productoId) VALUES (${clienteId},${productoId})`, (err, FavoritoRes) => {
        if(err){
            res.send({mensaje:`Error al guardar deseo`,exito:0});
            console.log("Close Connection");
            conectBD.end();
        }
        else{

            res.send({mensaje:`Deseo guardado`,exito:1});
            console.log("Close Connection");
            conectBD.end();
        }

    });

}

exports.eliminarFavorito = async (req,res)=>{

    const {clienteId,productoId} = req.body;

    const conectBD = MySQLBD.conectar();
    conectBD.query(`DELETE FROM ListaDeseos WHERE clienteId = ${clienteId} AND productoId = ${productoId}`, (err, FavoritoRes) => {
        if(err){
            res.send({mensaje:`Error al eliminar deseo`,exito:0});
            console.log("Close Connection");
            conectBD.end();
        }
        else{

            res.send({mensaje:`Deseo eliminado`,exito:1});
            console.log("Close Connection");
            conectBD.end();
        }

    });

}

exports.estadoFavorito = async (req,res)=>{

    const {clienteId,productoId} = req.body;

    const conectBD = MySQLBD.conectar();
    conectBD.query(`SELECT * FROM ListaDeseos WHERE clienteId = ${clienteId} AND productoId = ${productoId}`, (err, FavoritoRes) => {
        if(err){
            res.send({mensaje:`Error al comprobar favoritos`,exito:0});
        }
        else if(FavoritoRes.length){
            res.send({mensaje:`estado favorito encontrado`,deseo:FavoritoRes,exito:1});
        }else{
            res.send({mensaje:`No hay favoritos`,exito:0});
        }

        console.log("Close Connection");
        conectBD.end();
    });

}

exports.listaFavoritos = async (req,res)=>{

    const clienteId = req.params.id;
    const conectBD = MySQLBD.conectar();

    conectBD.query(`SELECT p.*,i.productoImagen Imagen ,i.contentType ImagenTipo,CONCAT(u.nombre,' ',u.apellido) Usuario , c.nombre Categoria, c.Id CategoriaId,ld.Id Deseo FROM Productos p 
    INNER JOIN ImagenesProducto i ON p.Id = i.productoId
    INNER JOIN Categorias c ON c.Id = p.categoriaId
    INNER JOIN Usuarios u ON u.Id = p.personaId
    INNER JOIN ListaDeseos ld ON ld.productoId = p.Id
    AND ld.clienteId= ${clienteId} 
    AND p.estadoHabilitacion = TRUE
    GROUP BY p.Id`, (err, ProductoRes) => {
        
        if(err){
            res.send({mensaje:`Error al buscar productos `,exito:0});
            console.log("Close Connection");
            conectBD.end();
        }else{
            if(ProductoRes.length){
            res.send({mensaje:'Productos encontrados',productos:ProductoRes,exito:1});
            }else{
            res.send({mensaje:'No hay Productos',exito:0})  
            }
        }
       
        console.log("Close Connection");
        conectBD.end(); 
    });

}

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

exports.verificarTiempoToken = async(req, res) => {
    const {token} = req.body
    const data = getTokenData(token);
    if(!data){
        res.send({mensaje:'Error token incorrecto o expirado', exito:0});
    }else{
        res.send({mensaje:'token funcional',data:data, exito:1});
    }

}