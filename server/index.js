//Main application starting point
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router.js');
const mongoose = require('mongoose');

//DB Connect
mongoose.connect('mongodb://192.168.1.7:27017/auth')

//App setup
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);
//Seerver Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server is listening on: ', port);
