const Coupone = require("../model/couponeModel")
const Offer=require('../model/offerModel')
const Product = require("../model/productModel")
const Category=require('../model/categoryModel')
const Cart=require('../model/cartModel')
const Order=require('../model/orderModel')
const { default: mongoose } = require("mongoose")

const coupone=async(req,res,next)=>{
    try {
        const{couponeId}=req.body
        const exist =await Coupone.findById(couponeId)
        if(exist){
            req.coupone=exist;
            next()
        }else{
            res.json({message:"This coupone doesn't exist",coupone:false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const couponeCode=async(req,res,next)=>{
    try {
        console.log(req.body)
        const{couponeCode}=req.body
        const exist =await Coupone.findOne({couponeCode:couponeCode})
        if(exist){
            req.coupone=exist;
            req.couponeApplied=true;
            next()
        }else{
            res.json({message:"This coupone doesn't exist",coupone:false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const couponeApplied=async(req,res,next)=>{
    try {
        

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
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const offer=async(req,res,next)=>{
    try {
      
        const{offerId}=req.body
        const exist =await Offer.findById(offerId)
        if(exist){
            req.offer=exist;
            next()
        }else{
            res.status(400).json({message:"This offer doesn't exist"})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}
const product =async(req,res,next)=>{
    try {
        console.log(1)
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
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const cart= async(req,res,next)=>{
    try {
        if(req.body.cart){
            
            
            const exist = await Cart.findOne({ user: req.session.userId })
            .populate({
              path: 'cartItems.product',
              select: 'effectedDiscount',
            });
            // console.log('------------exist-------',req.cart.cartItems[0].product.effectedDiscount)
            if(exist){
                req.cart=exist
            }else{
                res.status(400).json({message:"user doesn't owne a cart "})

            }
            next()
        }else{
            next()
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}


const category =async(req,res,next)=>{
    try {
      
        const{categoryId}=req.body
        const exist =await Category.findById(categoryId)
        if(exist){
            req.category=exist;
            next()
        }else{
            res.status(400).json({message:"This category doesn't exist"})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const order=async(req,res,next)=>{
    try {
        const {orderId}=req.body
        
        const exist=await  Order.findOne({customer:req.session.userId,_id:new mongoose.Types.ObjectId(orderId)})
        console.log(exist)
        if(exist){
            req.order=exist
            next()
        }else{
            res.json({message:"This order doesn't exist",canceled:false})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const orderId=async(req,res,next)=>{
    try {
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
    
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}
const orderForAdmin=async(req,res,next)=>{
    try {
        const {orderId}=req.body
        
        const exist=await  Order.findById(orderId)
       
        if(exist){
            req.order=exist
            next()
        }else{
            res.json({message:"This order doesn't exist",success:false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}






module.exports={
    coupone,
    offer,
    product,
    category,
    couponeCode,
    couponeApplied,
    cart,
    order,
    orderId,
    orderForAdmin

}