const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
    name:{
        type: String , 
        required: [true ,'Please enter name']
    },
    description:{
        type: String, 
        required:[true ,'Please enter description']
    }, 
    price:{
        type: Number, 
        required:[true ,'Please enter price'],
        maxLength:[8,'Please enter price below this']
    },
    ratings:{
        type: Number,default:0
    },
    images:[ {
        public_id: { 
            type:String ,
             required:true
        },
        url:{
            type:String, required:true
        }
    }
], 
category:{
    type:String,
    required:[true ,'Please enter product category']
},
stock:{ type:Number, 
    required:[true,'please enter stock'],
     maxLength:[4,'Please enter stock below this'],
    default:1
}, 
numOfReviews:{ 
    type:Number,
    default:0
},
reviews:[{
    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"
    }, 
    name:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true,
    },
}],
// user:{
//     type:mongoose.Schema.ObjectId,
//     required:true,
//     ref:"User"
// },
createdAt:{
    type:Date,  
    default:Date.now
}
  
})


module.exports =mongoose.model('Product',productSchema)