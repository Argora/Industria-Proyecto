const jwt = require('jsonwebtoken');
require('dotenv').config();

const getTokenEmail = (email) =>{
    return jwt.sign(
        {data:email},
        process.env.JWT_SECRET,
        {expiresIn:'1h'});
};

const getTokenLogIn = (user) =>{
    return jwt.sign(
        {data:user},
        process.env.JWT_SECRET,
        {expiresIn:'15m'});
}

const getTokenData = (token) =>{
    let data = null;
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            console.log('token expirado o incorrecto');
        }else{
            data = decoded;
        }
    });

    return data;
};


module.exports = {
    getTokenEmail,
    getTokenData,
    getTokenLogIn
};