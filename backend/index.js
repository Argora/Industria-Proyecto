const express= require('express');
const bodyParser= require('body-parser');
const path = require('path');
const cors = require('cors');
const { isObject } = require('util');
const app = express();
const http = require('http').Server(app);

//MIDDLEWARE

//CORS-> INTEGRACION CON AGULAR
app.use(cors());

//INTERPRESTE DE JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//ROUTES

app.use('/api/productos',require('./routes/productos'));

//SETTINGS

const port = process.env.PORT || 3000;
http.listen(port,()=>{
    console.log("Servidor iniciado");
});