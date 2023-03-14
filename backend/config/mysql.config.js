const mysql = require('mysql');


function conectar() { 
    conexion =  mysql.createConnection({
      host:"base01.c7i4ct5s8ir5.us-east-1.rds.amazonaws.com",
      user:"admin" ,
      password: "base1234",
      database: "Base"
});

conexion.connect((err)=>{
    if(err) throw err;
    console.log("Connected to database");
});

return conexion;
}


module.exports = {
  conectar,
  mysql
}