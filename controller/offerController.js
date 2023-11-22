const Offer=require('../model/offerModel')
const Product=require('../model/productModel')
const Category=require('../model/categoryModel')
const offerHelper=require('../helperMethods/offer')
const loadAddOffer=(req,res)=>{
    try {

        res.render('addOffer')
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const addOffer=async(req,res)=>{
    try {

        const offer=new Offer(req.offer)
        const created=await offer.save()

        if(created){
            res.json({message:'offer created',created:true})
        }else{
            res.json({message:'offer creation failed',created:false})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const loadViewOffers=async(req,res)=>{
    try {
       
        
        const {page=1,pagesize=5}=req.query

        const offset=(page-1)*pagesize//specifies how much data to be skipped
        const limit=pagesize//specifies how much data needed
        

        const totalOrdes=await Offer.countDocuments()
        const totalpages=Math.ceil(totalOrdes/pagesize)

        const offers=await Offer.find({}).sort({ updatedAt: -1 }).skip(offset).limit(limit)
        res.render('viewOffers',{offers:offers,currentPage:page,totalpages:totalpages,pagination:true}) 
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const loadEditOffer=async(req,res)=>{
    try {
        const {id}=req.query

        const offer=await Offer.findById(id)
        res.render('editOffer',{offer:offer})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const updateOffer=async (req,res)=>{

    try{
    const updatedOffer = await Offer.findOneAndUpdate(
        { _id: req.body.offerId },
        { $set: req.offer },
        { new: true } 
        );

    if(updatedOffer){
        res.json({updated:true,message:'offer Updated successfully'})
    }else{
        res.json({updated:false,message:'offer Updation failed'})

    }
    
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}
const listUnlistOffer=async(req,res)=>{
    try {

        if( req.offer.status){
            req.offer.status=false
        }else{
            req.offer.status=true
        }
        const updatedOffer = await  req.offer.save()
        if(updatedOffer){
            res.json({updated:true,message:'offer status changed',status:updatedOffer.status})
        }else{
            res.json({updates:false,message:'failed to change offer status'})
        }
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const getOffers=async(req,res)=>{
    try {
       
        const offers=await Offer.find({status:true,expireDate:{$gt:new Date()}}).sort({updatedAt:-1})
        res.render('offerList',{offers:offers})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const applyOfferToProduct=async(req,res)=>{
    try {
        const offer=await offerHelper.findProductLargestOffer(req.product._id)
        if(Number(offer.largestOffer.discountPercentage)>Number(req.offer.discountPercentage)){
            req.product.effectedDiscount=Number(offer.largestOffer.discountPercentage)
            req.product.effectedOfferStartDate=offer.largestOffer.startDate
            req.product.effectedOfferEndDate=offer.largestOffer.expireDate
        }else{
            const currentDate=new Date()
            if(req.offer.startDate<currentDate && req.offer.expireDate>currentDate){
            req.product.effectedDiscount=Number(req.offer.discountPercentage)
            req.product.effectedOfferStartDate=req.offer.startDate
            req.product.effectedOfferEndDate=req.offer.expireDate
            }else{
                req.product.effectedDiscount=0
                req.product.effectedOfferStartDate=null
                req.product.effectedOfferEndDate=null
            }

        }
        // =Math.max(Number(offer.largestOffer.discountPercentage),Number(req.offer.discountPercentage))

        
        req.product.offer=req.body.offerId
 
        const applied=await req.product.save()
        
        if(applied){
            res.json({applied:true,message:"Offer applied to product",offer:req.offer})
        }else{
            res.json({applied:false,message:"Offer applying to product failed"})

        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const removeOffer=async(req,res)=>{
    try {

        const offer=await offerHelper.findProductLargestOffer(req.product._id)
        req.product.effectedOfferStartDate=offer.largestOffer.startDate
        req.product.effectedOfferEndDate=offer.largestOffer.expireDate
        
        req.product.effectedDiscount=Number(offer.largestOffer?.discountPercentage)


        req.product.offer=null
        const removed=await req.product.save()
        if(removed){

            res.json({removed:true,message:'offer removed successfully'})
        }else{
            res.json({removed:false,message:'offer removal failed'})

        }
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const applyOfferToCategory=async(req,res)=>{
    try {
        
        req.category.offer=req.body.offerId
        const category=Category(req.category)
        const applied=await category.save()
        if(applied){
            await offerHelper.setEffectedDiscounts(req.category._id)
            res.json({applied:true,message:"Offer applied to category successfully",offer:req.offer})
        }else{
            res.json({applied:false,message:"Offer applying to category failed"})

        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const removeCategoryOffer=async(req,res)=>{
    try {
        req.category.offer=null
        const removed=await req.category.save()
        if(removed){
            await offerHelper.setEffectedDiscounts(req.category._id)
            res.json({removed:true,message:'offer removed successfully'})
        }else{
            res.json({removed:false,message:'offer removal failed'})

        }
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}

module.exports={
    loadAddOffer,
    addOffer,
    loadViewOffers,
    loadEditOffer,
    updateOffer,
    listUnlistOffer,
    getOffers,
    applyOfferToProduct,
    removeOffer,
    applyOfferToCategory,
    removeCategoryOffer
}