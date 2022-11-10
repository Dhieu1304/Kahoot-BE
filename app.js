const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { initRouter } = require("./components/route.init");
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: "*",              //origin:'http://localhost:3012',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}));
initRouter(app);

module.exports = app;
