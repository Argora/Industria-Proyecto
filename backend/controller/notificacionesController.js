const path =require('path');
const MySQLBD = require("../config/mysql.config");

exports.nuevoToken = async (req, res, next) => {

    const conectBD = MySQLBD.conectar();

    const token = req.body;

    conectBD.query(`INSERT INTO Subscripciones(idUsuario, endpoint, time) VALUES
    ('${token.id}','${token.endpoint}',${token.time})`, (err, tokenRes) => {
        if(err){
            res.send({mensaje:'Error al insertar el token',exito:0});
            
        }else{

            res.send({mensaje:'Se ha guardado el token',exito:1});//,productoId:ProductoRes.insertId
           
        }
        console.log("Close Connection");
        conectBD.end(); 
    })
}