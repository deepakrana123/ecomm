const ErrorHandler = require('../utils/errorHandler');


module.exports = (err , req , res , next) => {
    err.statusCode = err.statusCode ||500;
    err.message = err.message || 'Internal Server Error';
// wrong mongodb id error
    if(err.name ==='CastError'){
        const message =`resoucre not found Invalid ${err.path}`
        err = new ErrorHandler(400, message);
    };

    if(err.code === 11000){
        const message = `duplicate key ${Object.keys(err.keyvalue)} ,please find new email ${err.path}`
        err = new ErrorHandler(400, message);
    }

    if(err.name === 'jsonwebTokenError'){
        const message='json web token is invalid , try again';
        err=new ErrorHandler(400, message);
    }

    if(err.name ==='jsontokenExpiredError'){
        const message = 'json web token is required , try again';
        err =new ErrorHandler(400, message);
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        error:err.stack
    })
}