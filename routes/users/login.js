const jwt = require('../../auth/jwtAuth');
const { db } = require('../../config/database');

const login = async(req, res)=>{
    const { nickname, pw} = req.body;
    try{
       db.query(`SELECT * FROM user`, function(err,rows,fields,result){
            //const {nick, pwd } = db.query(`SELECT * FROM user`, function(err,rows,fields,result){
            if(err){
                console.log('db false');
                throw err;
            }else{
                //console.log(typeof(nickname));
                const exUser = rows.filter(row=> row.nick == nickname, (err)=>{
                    res.status(401).send(err);
                });
                //console.log(exUser);
                ///console.log(result.nick);
                //console.log(json);
                //console.log(obj[0].pwd);
                if(!exUser[0]){
                    return res.status(419).send('없는 아이디 입니다');
                }
                    const json = JSON.stringify(exUser); //Json String 형태로 변환
                    const user = JSON.parse(json); //json 배열 형태로 파싱 
                if(pw !== user[0].pwd){
                    return res.status(420).send({
                        ok : false,
                        message: '틀린 비밀번호 입니다.'
                    });
                }
                
                const accessToken = jwt.sign(user[0]); //access 토큰 발급
                const refreshToken = jwt.refresh(); //refresh token 발급
                
                //redisClient.set(obj[0].id,refreshToken); //refresh token을 redis에 키를 user id로 하여 저장
                return res.status(200).send({ //client에 모든 토큰 반환
                    ok : true,
                    data : {
                        accessToken,
                        refreshToken,
                    },
                });
            }
            
        })
    }catch(err){
        console.log(err);
        res.status(401).send('DB Get False');
    }
};


module.exports = login;