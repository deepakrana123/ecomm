const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const errorMiddleware = require('./middleware/error');
const cookie_parser = require('cookie-parser');
const bodyParser =require('body-parser');
const fileUpload =require('express-fileupload');

app.use(
    express.urlencoded({ extended: true })
);
app.use(bodyParser.urlencoded({ extended: true}))

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload);
const product = require('./route/productRoute')
const userRoute = require('./route/userRoute');
const orderRoute = require('./route/orderRoute');

app.use('/api/v1' , userRoute);
app.use('/api/v1' , orderRoute);

app.use('/api/v1', product);

app.use(errorMiddleware);

module.exports = app;