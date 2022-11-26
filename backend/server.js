const app = require('./app');
const dotenv = require('dotenv');
const cloudinary=require('cloudinary');
const database = require('./config/database');


process.on('uncaughtException', (err) => {
    console.log(`uncaught expection ${err.message}`);
    console.log(`Shutting down server due to unhandle server rejection`);
    server.close(()=>{
        process.exit(1)
    })
})
dotenv.config({path : 'backend/config/config.env'});

database();

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.cloud_api_key, 
    api_secret: process.env.cloud_api_secret,
    secure: true
  });
const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
});
// unhandled promise reject with

process.on('unhandledRejection',(err)=>{
    console.log(`Error ${err.message}`);
    console.log(`Shutting down server due to unhandle server rejection`);
    server.close(()=>{
        process.exit(1)
    });
})