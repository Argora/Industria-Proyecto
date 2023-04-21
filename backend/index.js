const express= require('express');
const bodyParser= require('body-parser');
const path = require('path');
const cors = require('cors');
const { isObject } = require('util');
const app = express();
const http = require('http').Server(app);
const https = require('https');
const fs = require('fs');

//MIDDLEWARE

//CORS-> INTEGRACION CON AGULAR
app.use(cors());

//INTERPRESTE DE JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//ROUTES

app.use('/api/productos',require('./routes/productos'));
app.use('/api/usuarios', require('./routes/usuarios'));

//SETTINGS

const port = process.env.PORT || 3000;
https.createServer({
    cert: fs.readFileSync('/etc/letsencrypt/live/hondumarket-info.store/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/hondumarket-info.store/privkey.pem')
}, app).listen(port, function(){
    console.log('servidor https iniciado');
});

// http.listen(port,()=>{
//     console.log("Servidor iniciado");
// });