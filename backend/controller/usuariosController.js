const fs = require('fs');
const path =require('path');
const bcrypt = require('bcrypt');
const MySQLBD = require("../config/mysql.config");
const {getVerifyTemplate, sendEmailVerify} = require('../config/correo.config');
const {getTokenEmail, getTokenData} = require('../config/token.config');

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
    const {nombre,apellido,email,passw,municipio,telefono,direccion} = req.body;
    
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
                                        }
                                        else {
                                        //Generando token de identificación para correo
                                        const token = getTokenEmail(email);
    
                                        //Cargando template de correo de confirmación
                                         const template = getVerifyTemplate(nombre+' '+apellido,token);
      
                                        //Enviando correo de confirmación
                                        sendEmailVerify(email,'Confirmar Cuenta',template);
                                        res.send({mensaje:'Usuario insertado',guardado:1});
    
                                        }
                                        
                                        console.log("Close Connection");
                                        conectBD.end();
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
         console.log('asdf')
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