const Banner=require('../model/bannerModel')
const adminHelpers=require('../helperMethods/adminHelpers')
const path=require('path')
const asyncErrorHandler= require('../Utils/asyncErrorHandler')
const CustomError = require('../Utils/CustomError')

const loadBanner=asyncErrorHandler( async(req,res)=>{

    const banners=await Banner.aggregate([
        {
            $match:{
                deleted:false
            }
        }
    ])
    
    res.render('banner',{admin:true,banners:banners})

})

const loadAddBanner= async(req,res, next)=>{

    res.render('addBanner',{admin:true})
}

const addBanner=asyncErrorHandler( async(req,res, next)=>{

    const banner=new Banner(req.bannerData)
    const added=await banner.save()
    if(added){
        res.json({success:true,message:'New Banner Added'})
    }else{
        
        const err= new CustomError('unable to add new banner',500)
        next(err)

    }

})

const updateBannerStatus=asyncErrorHandler( async(req,res, next)=>{

    const banner=req.banner
    
    if(banner.status){
    banner.status=false
    }else{
    banner.status=true
    }
    
    const updated= await banner.save()

    if(updated){
    res.json({success:true,message:'banner status updated successfully',status:banner.status})
    }else{
        const err= new CustomError('banner status updation failed',500)
        next(err)
    }

})

const loadEditBanner=asyncErrorHandler( async(req,res, next)=>{
 
  res.render('editBanner',{admin:true,banner:req.banner}) 
})

const updateBanner=asyncErrorHandler( async(req,res, next)=>{

    const banner=req.banner
    const updated = await Banner.findOneAndUpdate(
        { _id: banner._id },
        { $set: req.bannerData },
        { new: true } // To return the updated document
        );
    
    if(updated){
        const url=path.join(__dirname,'..','public','bannerImages',banner.bannerBackground)
        console.log(url)
        adminHelpers.deleteFile(url)

        res.json({success:true,message:'Banner Updated'})
    }else{
        const err= new CustomError("Banner Updation Failed",500)
        next(err)

    }
        
})

const deleteBanner=asyncErrorHandler(async(req,res, next)=>{

    const banner=req.banner
    
    banner.deleted=true
    
    const updated= await banner.save()

    if(updated){
        res.json({success:true,message:'banner deleted successfully',status:banner.status})
    }else{
        res.json({success:false,message:'banner deletion failed'})
    }

})


module.exports={
    loadBanner,
    loadAddBanner,
    addBanner,
    updateBannerStatus,
    loadEditBanner,
    updateBanner,
    deleteBanner
}