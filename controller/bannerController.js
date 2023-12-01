const Banner=require('../model/bannerModel')
const adminHelpers=require('../helperMethods/adminHelpers')
const path=require('path')

const loadBanner=async(req,res)=>{
    try {
        const banners=await Banner.aggregate([
            {
                $match:{
                    deleted:false
                }
            }
        ])
     
        res.render('banner',{admin:true,banners:banners})
        
    } catch (error) {
        console.log(error)
    }
}

const loadAddBanner=async(req,res)=>{
    try {
        
        res.render('addBanner',{admin:true})
    } catch (error) {
        console.log(error)
        
    }
}

const addBanner=async(req,res)=>{
    try {
        
        const banner=new Banner(req.bannerData)
        const added=await banner.save()
        if(added){
            res.json({success:true,message:'New Banner Added'})
        }else{
            res.json({success:false,message:"can't add new banner"})

        }
    } catch (error) {
        console.log(error)
        
    }
}

const updateBannerStatus=async(req,res)=>{
    try {
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
        res.json({success:false,message:'banner status updation failed'})

       }
        
    } catch (error) {
        console.log(error)
        
    }
}

const loadEditBanner=async(req,res)=>{
    try {
        res.render('editBanner',{admin:true,banner:req.banner})
        
    } catch (error) {
        console.log(error)
        
    }
}

const updateBanner=async(req,res)=>{
    try {
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
            res.json({success:false,message:"Banner Updation Failed"})

        }
        
        
    } catch (error) {
        console.log(error)
        
    }
}

const deleteBanner=async(req,res)=>{
    try {
        const banner=req.banner
        
        banner.deleted=true
        
        const updated= await banner.save()
 
        if(updated){
         res.json({success:true,message:'banner deleted successfully',status:banner.status})
        }else{
         res.json({success:false,message:'banner deletion failed'})
 
        }
        
    } catch (error) {
        console.error(error)
    }
}


module.exports={
    loadBanner,
    loadAddBanner,
    addBanner,
    updateBannerStatus,
    loadEditBanner,
    updateBanner,
    deleteBanner
}