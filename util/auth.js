const { verify } = require('../auth/jwtAuth');

const authJWT = (req, res,next) =>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split('Bearer ')[1];
        const result = verify(token); //token 검증
        if(result.ok){
            req.id = result.id;
            next();
        }else{
            res.status(401).send({
                ok : false,
                message : result.message, //jwt가 만료되었다면 메세지는 'jwt expired'입니다.
            })
        }
    }
}

module.exports = authJWT;