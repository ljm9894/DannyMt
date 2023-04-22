const { sign, verify, refreshVerify } = require('../routes/auth');
const jwt = require('jsonwebtoken');

const refresh = async (req, res) => {
    //access토큰과 refresh토큰의 유무 확인
    if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;

        // access 토큰 검증 -> expired여야 한다.
        const authResult = verify(authToken);

        // access 토큰 디코딩하여 user의 정보를 가져온다.
        const decoded = jwt.decode(authToken);

        //디코딩 결과가 없으면 권한 없음을 응답.
        if (decoded === null) {
            res.status(401).send({
                ok: false,
                message: '권한 없음',
            });
        }

        //access 토큰의 decoding 된 값에서 유저의 id를 가져와 refresh 토큰을 검증한다.
        const refreshResult = refreshVerify(refreshToken, decoded.id);

        //재발급을 위해 access token이 만료되어 있어야 한다.
        if (authResult.ok === false && authResult.message === 'jwt expired') {
            //1.access 토큰이 만료되고, refresh 토큰도 만료된 경우
            if(refreshResult.ok === false){
                res.status(401).send({
                    ok: false,
                    message : '권한 없음'
                });
            }else{
                const newAccessToken = sign(user);
                res.status(200).send({ // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환
                    ok:true,
                    data: {
                        accessToken : newAccessToken,
                        refreshToken,
                    },
                });
            }
        }else{
            res.status(400).send({
                ok : false,
                message : '엑세스 토큰이 아직 만료되지 않음.',
            });
        }
    }else{
        res.status(400).send({
            ok : false,
            message : 'access 또는 refresh 토큰이 refresh토큰 발급을 위해 필요합니다'
        });
    }
}

module.exports = refresh;