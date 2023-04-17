const nodemailer = require("nodemailer");
//url local
const url ='http://localhost:4200';
//url AWS
//const url = '';

const getVerifyTemplate = (name,token)=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificar Cuenta</title>
    </head>
    <body>
        <div class="container" id="email_content">
        <h2>Hola ${name}</h2>
    <p>Para confirmar tu cuenta , ingresa al siguiente enlace</p>
    <a href="${url}/confirmarUsuario/${token}"> confirmar cuenta </a>
    
        </div>
        

        </body>
        </html>
    `;
};

const config = {
    host: "smtp.gmail.com", // hostname
    port: 587, // port for secure SMTP
    auth: {
      user: 'proyectois902@gmail.com',
      pass: 'dankjzxdtzebtlyq'
    }
};

const transporter = nodemailer.createTransport(config);
  

const sendEmailVerify = async (email,subject,html)=>{
      try {
        await transporter.sendMail({
            from: 'ProyectoIS902<no-reply@proyectois902>', // sender address
            to: email, // list of receivers
            subject, // Subject line
            text: "Verificar", // plain text body
            html, // html body
          });
          
      } catch (error) {
          console.log('error en el email ',error);
      }
};


module.exports ={
    sendEmailVerify,
    getVerifyTemplate
};