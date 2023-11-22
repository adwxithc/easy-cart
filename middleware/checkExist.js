const Coupone = require("../model/couponeModel")
const Offer=require('../model/offerModel')
const Product = require("../model/productModel")
const Category=require('../model/categoryModel')

const coupone=async(req,res,next)=>{
    try {
        const{couponeCode}=req.body
        const exist =await Coupone.findOne({couponeCode:couponeCode})
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
      
        const{productId}=req.body
        const exist =await Product.findById(productId)
        if(exist){
            req.product=exist;
            next()
        }else{
            res.status(400).json({message:"This product doesn't exist"})
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





module.exports={
    coupone,
    offer,
    product,
    category,

}