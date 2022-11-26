const mongoose =require('mongoose');
const validator = require('validator');
const bcyrpt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:[3,"Please give some extra charcater"],
        max:[30,"Please give some less charcater"]
    },
    password:{
        type:String,
        required:true,
        min:[4,"Please give some longer charcater"],
        max:[10,"Please give password in range of 8-10 charcater"],
       select:false
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail ,' invalid email'],
        trim:true,
        unique:true,
    },
     avatar:{
        public_id:{
            type:String, required:true
        },
        url:{
           type:String, required:true
        }
     },
    role:{
        type:String,
        default:"user",
    },

    created_At:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken:String, 
    resetPasswordExpire:String,
});

userSchema.pre("save" , async function (next){
     if(!this.isModified("password")){
     }
     this.password = await bcyrpt.hash(this.password , 10)
});

userSchema.methods.getJWTToken=function() {
        return jwt.sign({id:this._id} , process.env.JWT_Secret,
            {expiresIn:process.env.JWT_Expire})
}

userSchema.methods.comparePassword = function(enterpassword) {
    return bcyrpt.compare(enterpassword , this.password)
}

userSchema.methods.getResetPasswordToken =function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest('hex')
    this.resetPasswordExpire =Date.now() + 15*60*1000

    return resetToken;
}

module.exports = mongoose.model("User" , userSchema)