const Coupone = require("../model/couponeModel")
const Offer=require('../model/offerModel')
const Product = require("../model/productModel")
const Category=require('../model/categoryModel')
const Cart=require('../model/cartModel')
const Order=require('../model/orderModel')
const User=require('../model/userModel')
const Banner=require('../model/bannerModel')
const asyncErrorHandler=require('../Utils/asyncErrorHandler')
const { default: mongoose } = require("mongoose")
const CustomError = require("../Utils/CustomError")
const crypto=require('crypto')

const coupone=asyncErrorHandler( async(req,res,next)=>{

    const{couponeId}=req.body
    const exist =await Coupone.findById(couponeId)
    if(exist){
        req.coupone=exist;
        next()
    }else{
        res.json({message:"This coupone doesn't exist",coupone:false})
    }

})

const couponeCode=asyncErrorHandler( async(req,res,next)=>{

    
        const{couponeCode}=req.body
        const exist =await Coupone.findOne({couponeCode:couponeCode})
        if(exist){
            req.coupone=exist;
            req.couponeApplied=true;
            next()
        }else{
            res.json({message:"This coupone doesn't exist",coupone:false})
        }

})

const couponeApplied=asyncErrorHandler( async(req,res,next)=>{
    const{couponeCode}=req.body
    if(couponeCode){
        const exist =await Coupone.findOne({couponeCode:couponeCode})
        if(exist){
            console.log('couponeApplied=true',exist)
            req.couponeApplied=true
            req.coupone=exist;
            next()
        }else{
            res.json({message:"This coupone doesn't exist",coupone:false})
        }
    }else{
        console.log('couponeApplied=false')
        req.couponeApplied=false
        next()
    }
})

const offer=asyncErrorHandler( async(req,res,next)=>{

        const{offerId}=req.body
        const exist =await Offer.findById(offerId)
        if(exist){
            req.offer=exist;
            next()
        }else{
            res.status(400).json({message:"This offer doesn't exist"})
        }
        
})

const singleProduct =asyncErrorHandler( async(req,res,next)=>{

        if(req.body.productId){
            const{productId}=req.body
            const exist =await Product.findById(productId)
            if(exist){
                req.product=exist;
                next()
            }else{
                res.status(400).json({message:"This product doesn't exist"})
                }
        }else{
            next()
        }

})

const product=asyncErrorHandler( async(req,res,next)=>{

        const{productId}=req.body
        const exist =await Product.findById(productId)
        if(exist){
            req.product=exist;
            next()
        }else{
            res.status(400).json({message:"This product doesn't exist"})
        }

})

const cart=asyncErrorHandler( async(req,res,next)=>{

        if(req.body.cart){
                 
            const exist = await Cart.findOne({ user: req.session.userId })
            .populate({
              path: 'cartItems.product',
              select: 'effectedDiscount',
            });
            
            if(exist){
                req.cart=exist
            }else{
                res.status(400).json({message:"user doesn't owne a cart "})

            }
            next()
        }else{
            next()
        }

})


const category =asyncErrorHandler( async(req,res,next)=>{

        const{categoryId}=req.body
        const exist =await Category.findById(categoryId)
        if(exist){
            req.category=exist;
            next()
        }else{
            res.status(400).json({message:"This category doesn't exist"})
        }

})

const order=asyncErrorHandler( async(req,res,next)=>{

    const {orderId}= req.body 
    const exist=await  Order.findOne({customer:req.session.userId,_id:new mongoose.Types.ObjectId(orderId)})

    if(exist){
        req.order=exist
        next()
    }else{
        const err=new CustomError(" order doesn't exist",400)
        next(err)
        // res.json({message:"This order doesn't exist",canceled:false,success:false})
    }

})

const orderId=asyncErrorHandler( async(req,res,next)=>{

    const {orderId}=req.query
    const exist=await Order.findOne({customer:req.session.userId,_id:new mongoose.Types.ObjectId(orderId)})
                    .populate({
                        path: 'items.product',
                        populate: {
                            path: 'brand',
                            select: 'name description',
                            },
                    })
    if(exist){
        req.order=exist
        next()
    }else{
        res.status(400).json({message:'Order not found'}) 
    }
    
})

const orderForAdmin=asyncErrorHandler( async(req,res,next)=>{

    const {orderId}=req.body
    
    const exist=await  Order.findById(orderId)
    
    if(exist){
        req.order=exist
        next()
    }else{
        res.json({message:"This order doesn't exist",success:false})
    }

})

const refer=asyncErrorHandler( async(req,res,next)=>{

        const {refer}=req.session;
        if(refer){

            const user=await User.findOne({_id:refer},{fname:1,lname:1})
            if(user){
                req.refer=user
            }
        }
        next()

})

const hasCart=asyncErrorHandler( async(req,res,next)=>{

        const exist=await Cart.aggregate([
            {
                $match:{
                    user:new mongoose.Types.ObjectId(req.session.userId)
                }
            }
        ])
        if(exist){
            req.cart=exist[0]
        }
        next()

})

const banner=asyncErrorHandler( async(req,res,next)=>{

        const bannerId = req.query.bannerId || req.body.bannerId;
        
        
        const exist=await Banner.findOne({_id:new mongoose.Types.ObjectId(bannerId),deleted:false})
     

        if(exist){
            req.banner=exist;
            next()
        }else{
            
            const err=new CustomError("This banner doesn't exist",400)
            next(err)
        }

})

const user =asyncErrorHandler( async(req, res, next )=>{

    const exist=await User.findById(req.session.userId)
    if(exist){
        req.user=exist
        next()
    }else{
        const err=new CustomError("Invalid user or user doesn't exist",400)
        next(err)
    }

})

const orderedProduct=asyncErrorHandler( async(req, res, next)=>{

    const orderId = req.query.orderId || req.body.orderId;
    const productId = req.query.productId || req.body.productId;
    
    const order = await Order.aggregate([
    {
        $match: {
        customer:new mongoose.Types.ObjectId(req.session.userId),
        _id: new mongoose.Types.ObjectId(orderId)
        },
    },
    {
        $unwind: '$items'
    },
    {
        $match:{
        'items.product':new mongoose.Types.ObjectId(productId),
        'items.orderStatus':'Delivered'
        }
    },
    {
        $lookup: {
        from: 'products', 
        localField: 'items.product',
        foreignField: '_id',
        as: 'productDetails',
        },
    },
    {
        $unwind:'$productDetails'
    }
    ]);
 

  if(!(order && order.length>0)){
    const err = new CustomError('unAutherised request',401)
    next(err)
  }else{
    req.order=order[0]
    next()
  }

})

const validToken=asyncErrorHandler(async(req, res, next)=>{
    
  const token =req.query.token || req.body.token
  const email= req.query.email || req.body.email
  console.log(token,email)
   
    const user = await User.findOne({ email });

    if(!user){
        const err= new CustomError('Invalid user',401)
        return next(err)
    }
    const currentTimestamp=Date.now()/1000
    
    //checking the reset password link has not expired 
    if(currentTimestamp-user.resetPassword?.timestamp<300){
        
        const combinedString = `${token}|${user.resetPassword?.timestamp}`;
    
        const expectedSignature = crypto.createHash('sha256',process.env.RESET_PASSWORD_SECRET).update(combinedString).digest('hex');
 
        if(expectedSignature==user.resetPassword?.signature){
        
            return next()
        }
    }

    const err= new CustomError('Invalid or expired verification link',400)
    next(err)
})


module.exports={
    coupone,
    offer,
    product,
    singleProduct,
    category,
    couponeCode,
    couponeApplied,
    cart,
    order,
    orderId,
    orderForAdmin,
    refer,
    hasCart,
    banner,
    user,
    orderedProduct,
    validToken

}