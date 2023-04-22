const express= require('express');
const login = require('./login');
const signUp = require('./signUp');


const router = express.Router();

router.post('/login', login);
router.post('/signUp', signUp);


module.exports = router;