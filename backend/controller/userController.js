const User = require('../schema/userSchema');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../utils/catchAsyncError');
const sendToken=require('../utils/jwtToken');
const sendMailer= require('../utils/sendEmail');
const cloudinary=require('cloudinary');



exports.registerUser =catchAsyncError( async(req,res,next)=>{
    const {email , name , password}=req.body;
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"Avatars",
        width:150,
        crops:"scale"
    });
    console.log(myCloud.public_id,myCloud.url,"")
    const user = await User.create({name:name,password:password ,email:email,
        avatar:{
            public_id:myCloud.public_id, 
            url:myCloud.url 
        }
    });
    sendToken(user,201,res);
})



// authentication


exports.loginUser = catchAsyncError( async(req,res,next)=>{
    const {email , password} =req.body;

    if(!email || !password) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password" ,401))
    }

    sendToken(user , 200 , res)
});

exports.logoutUser = catchAsyncError(async(req,res, next )=>{

    res.cookie('token' ,null ,{
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({success:true , message:'Logged out successfully'});
});


exports.forgetPassword = catchAsyncError(async(req,res,next)=>{
   const user =await User.findOne({email:req.body.email});
   if(!user){
    return next(new ErrorHandler(404 ,'User not found'));
   }

//    get reset tokens

const resetToken = await user.getResetPasswordToken();

await user.save({validateBeforeSave:true});

const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/reset/${resetToken}`

const message =`Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not request this email please ignore`;

try{
    await sendEmail({
           email:user.email,
           message,
           subject:'Ecommerce site'
    })

    res.status(200).json({success:true , message:'Email sends successfully'})
}
catch(error){
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save({validateBeforeSave:true})

    return next(new ErrorHandler( 500,error.message))
}
})

exports.resetPassword =catchAsyncError(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('Hex');

    const user = await User.findOne({ 
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    })

    if(!user){
        return next(new ErrorHandler(400,'Reset password token is invalid'));

    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();

    sendToken(user,200,res);

});


exports.getUserDeatils = catchAsyncError( async(req,res,next)=>{
    const user =await User.findById(req.user.id);
    res.status(200).json({success:true , message:"these is the user profile data", user })
});

exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    const user =await User.findById(req.user.id).select('+password');
    const isPasswordMatched=user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler(401,"Oldpassword is incorrect"));
    }
    if(req.body.newPassword !== req.body.confirmPassword){
         return next(new ErrorHandler(400,"Newpassword and confirmpassword are not matched"));
    }

    user.password=req.body.newPassword;
    sendToken(user,200,res)

});


exports.userProfile = catchAsyncError( async(req,res,next)=>{
    const newUserData={
        name:req.body.name,email:req.body.email
    }
    if(req.body.avatar !=""){
        const user =await  User.findById(req.params.id);
        const imageId = user.avatar.public_id;

       await  await cloudinary.v2.uploader.destory(imageId);

       const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"Avatars",
        width:150,
        crops:"scale"
    });

    newUserData.avatar={
        public_id:myCloud.public_id,
        url:myCloud.url
    }
}

    
    const user= await User.findByIdUpdate(req.params.id, newUserData,{
        new:true,useFindAndModify:true,runValidators:true
    });
  res.status(200).json({success:true, message:"Profile Updated Successfully" , user})

})


exports.getAllUser=catchAsyncError( async(req,res,next)=>{
    const users =await User.find();
    res.status(200).json({success:true, message:"All user",users})
});

exports.getAdminUserDeatils=catchAsyncError( async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User doesnot exist ${req.body.id}`))
    }
    res.status(200).json({success:true,message:"find",user})
});

exports.updateRole=catchAsyncError( async(req,res,next)=>{
    const newUserData={
        name:req.body.name,email:req.body.email,role:req.body.role
    }

    const user= await User.findByIdUpdate(req.params.id, newUserData,{
        new:true,useFindAndModify:true,runValidators:true
    });
  res.status(200).json({success:true, message:"Profile Updated Successfully"})

});

exports.deleteUser=catchAsyncError( async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(400,"User doesnot exist with id"))
    }
   await user.remove()
    res.status(200).json({success:true, message:"user deleted"})
})