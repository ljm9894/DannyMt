const { db } = require('../../config/database');
const bcrypt = require('bcrypt')
const jwt = require('../../auth/jwtAuth');

const signUp = async (req, res) => {
    const { nickname, pw, num, name } = req.body;
    const hashpwd = await bcrypt.hash(pw, 10);
    let isUser = false;
    //console.log(req.body);
    try {
        //const findID = `SELECT nick, school_num FROM user WHERE nick = '${nickname}'`;
        db.query('SELECT * FROM user WHERE nick = ?', [nickname], (err, results) => {
            if (err) {
                console.error(err);
                throw err;
            }
            //console.log(results[0].school_num.length);
            if (results.length > 0) {
                    //중복된 아이디가 이미 존재하는 경우
                    res.status(409).send({ success: false, message: '이미 아이디가 존재합니다.' })
            }
            else {
                db.query('SELECT * FROM user WHERE school_num = ?', [num], (err, results) => {
                    if (err) {
                        console.error(err);
                        throw err;
                    }
                    if (results[0].school_num.length > 0) {
                        res.status(409).send({ success: false, message: '이미 학번이 존재합니다.' })
                    }else{
                        const InsertUser = `INSERT INTO user (nick,pwd,school_num, user_name) VALUES ('${nickname}','${hashpwd}', '${num}', '${name}')`;
                        db.query(InsertUser, (err, rows) => {
        
                            if (err) {
                                console.error(err);
                                throw err;
                            }
                            const acessToken = jwt.sign(rows);
                            return res.status(200).send({
                                ok: true,
                                data: {
                                    acessToken,
                                },
                                message: '회원가입 성공'
                            });
                        })
                    }
                });
            }

        })


    }

    catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: err
        });
    }
};

module.exports = signUp;