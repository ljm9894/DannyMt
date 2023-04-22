const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;


module.exports = {
    sign : (user) =>{
        const payload = {
            id : user.id,
        }
        return jwt.sign(payload, secret,{
            algorithm : 'HS256',
            expiresIn : '1h',
            issuer : 'woaud',
        });
    },
    verify : (token) => {
        let decoded = null;
        try{
            decoded =jwt.verify(token,secret);
            return{
                ok: true,
                id: decoded.id,
            };
        }catch(err){
            return{
                ok: false,
                message: err.message,
            };
        }
    },
    refresh: ()=>{
        return jwt.sign({}, secret, {
            algorithm : 'HS256',
            expiresIn : '14d',
            issuer : 'woaud',
        });
    },
    checkToken : (req,res,next)=>{
        let token = req.get("authorization");
        if(token){
            token = token.slice(7);
            jwt.verify(token, "[Token]", (err,decoded)=>{
                if(err){
                    return res.json({
                        success: 0,
                        message: "Invalid Token..."
                    });
                }else{
                    req.decoded= decoded;
                    next();
                }
            });
        }else{
            return res.json({
                success:0,
                message: "Access Denied! Unautorized User"
            })
        }
    }
}