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
    <a href="${url}/confirmarCuenta/${token}"> confirmar cuenta </a>
    
        </div>
        

        </body>
        </html>
    `;
};

const mail ={
    user:'',
    pass:''
};

var transporter = nodemailer.createTransport(({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    //service: 'gmail',
    //host: 'smtp.gmail.com',
    auth: {
      user: mail.user,
      pass: mail.pass
    }
  }));
  

const sendEmailVerify = async (email,subject,html)=>{
      try {
        await transporter.sendMail({
            from: `NTT: <${mail.user}>`, // sender address
            to: email, // list of receivers
            subject, // Subject line
            text: "Verificar", // plain text body
            html, // html body
          });
          
      } catch (error) {
          console.log('error en el email ',error);
      }
};