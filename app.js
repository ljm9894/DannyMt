const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./routes');
const { db } = require('./config/database');
const app = express();
require('dotenv').config();
//const port = process.env.PROCESS_PORT;
const port = 8010

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('database connected');
});
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(bodyParser.json());


app.use('/', router);

app.listen(port, ()=>{
    console.log(`${port} waiting..`);
})