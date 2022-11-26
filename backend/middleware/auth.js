const catchAsyncError=require('../utils/catchAsyncError');
const ErrorHandler=require('../utils/errorHandler')
const jwt = require('jsonwebtoken')
const User =require('../schema/userSchema')
exports.isAuthenticated =catchAsyncError( async (req,res , next )=>{
    const {token} =req.cookies;
    if(!token){
     return next(new ErrorHandler('Please login first' ,400))
    }

    const decodedData = jwt.verify(token , process.env.JWT_Secret);
    req.user = await User.findById(decodedData.id);

    next();

});

exports.authorsizeRole =(...roles)=>{
    
    return (req,res, next) => {
        if(!roles.includes(req.user.role)){
            new ErrorHandler(`Role:${req.user.role} is not allowed to execess this resoucre`),403
        }
        next();
    }
}