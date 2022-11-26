const product =require('../schema/productSchema');
const Errorhandler=require('../middleware/error')
const catchAsyncError=require('../utils/catchAsyncError');
const Order = require('../schema/orderSchema');
const ErrorHandler = require('../utils/errorHandler');


exports.newOrder = catchAsyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemPrice,totalPrice,taxPrice,shippingPrice}=req.body;

    const order = await Order.create({
        shippingInfo , orderItems , paymentInfo , itemPrice , totalPrice , taxPrice,shippingPrice
       ,paidAt:Date.now(),requser:req.user._id
    })

    res.status(201).json({success:true,order})
});

exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.findById(req.params.id).populate("user" ,"name email");
    if(!order){
        return next(new ErrorHandler(404,"order not found"))
    }

    res.status(200).json({success:true,orders})
});

exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const order = await Order.find({user:req.user.id});
    res.status(200).json({success:true,order})
});

exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find();
    let totalAmount=0;

    orders.forEach((key)=>{
        totalAmount+= order.totalPrice
    })
    res.status(200).json({success:true,orders,totalAmount});
});

exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(404,"Order not found with this id"))
    }
    if(order.orderStatus ==='Delivered'){
        return next(new ErrorHandler(400,"You have already delivered the order"))
    }
    order.orderItems.forEach(async(item)=>{
        await updateStock(item.prodcut, item.quantity)
    })
    order.orderStatus=req.body.status;
    if(req.body.status==='Delivered'){
        order.deliveredAt=Date.now();
    }

    await order.save({validateBeforeSave:true})
    res.status(200).json({success:true,order})
});


async function updateStock(id,quantity){
   const product =await Product.findById(id);
   product.stock-=quantity;
   await product.save({validateBeforeSave:true})


}


exports.deleteOrder= catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.param.id);
    if(!order){
        return next(new ErrorHandler(404,"Order not found with this id"))
    }
    await order.remove();

    res.status(200).json({success:true})
});