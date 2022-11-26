const Product =require('../schema/productSchema');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../utils/catchAsyncError');
const ApiFeatures=require('../utils/apiFeatures');



exports.createProduct= catchAsyncError( async (req,res,next)=>{
    // req.body.user=req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({success:true, product , message:'Product created'})
});


exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();
  
    let products = await apiFeature.query;
  
    let filteredProductsCount = products.length;
  
    apiFeature.pagination(resultPerPage);
  
    products = await apiFeature.query;
  
    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
  });
exports.getSingleProducts =catchAsyncError( async(req,res,next)=>{
    const product =await Product.findById(req.params.id);
    if(!product){
       return next(new ErrorHandler( 404,'Product Not found' ))
    }
    res.status(200).json({success: true, message: 'single product value' , product});
});


exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    const product =await Product.findById(req.params.id);
    if(!product){
    // /    return res.status(500).json({message: 'Product not found',success:false})
      return next(new ErrorHandler( 404,'Product not found'))
    }

    await product.remove();

    res.status(200).json({message: 'Product deleted Successfully' , success:true})
});

exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    let product =await Product.findById(req.params.id);
    if(!product){
        // return res.status(500).json({message: 'Product not found',success:false})
  return next(new Errorhandler( 404,'Product not found'))
    }

    product =await Product.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true,useFindAndModify:true});
  res.status(200).json({message: 'Product updated',success:true,prodcut})
});


// create a review or update a review group


exports.createAndUpdateReview = catchAsyncError( async(req,res,next)=>{
     const {rating , comment ,productId}=req.body;

     const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
     };

     const product = await Product.findById(productId);

     const isReviewed = product.reviews.find(rev =>rev.user.toString()===req.user._id.toString());
     if(!isReviewed){
           product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString)
            (rev.rating =rating), (rev.comment=comment)
           });
     }
     else{
        product.reviews.push(review)
        product.numOfReviews=product.reviews.length
     }
     let avg=0;
    product.reviews.forEach((rev)=>{
        avg+=rev.rating

     })
     product.ratings = avg/product.reviews.length;
      await product.save({validatebeforeSave:false});

      res.status(200).json({success:true,message:'Review added successfully'})
})

exports.getAllReviews=catchAsyncError( async(req,res,next)=>{
    const product =await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler(400,"Product not found"))
    }
    res.status(200).json({success:true,message:'Reviews',reviews:product.reviews})
})

exports.deleteReview= catchAsyncError( async(req,res,next)=>{
  const product  =await Product.findById(req.query.productId);
  if(!product){
    return next(new ErrorHandler(400,"Product not found"))
  }
  const reviews = product.reviews.filter(rev=>rev._id.toString() === req.query.id.toString());
  let avg=0;
  reviews.forEach((rev)=>{
      avg+=rev.ratings

   })

   const ratings=avg/reviews.length;
   const numOfReviews = reviews.length;

   await Product.findByIdAndUpdate(req.query.productId,{
    reviews,ratings,numOfReviews,
   },{ new:true,runValidators:true,useFindAndModify:false})

}) 

