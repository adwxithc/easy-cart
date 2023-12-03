const Brand=require('../model/brandModel')
const Product=require('../model/productModel')
const adminHelpers=require('../helperMethods/adminHelpers')
const path=require('path')
const asyncErrorHandler = require('../Utils/asyncErrorHandler')
const CustomError = require('../Utils/CustomError')


const validateProductDatas=asyncErrorHandler( async(req,res,next)=>{

        const images=[]
        for(let image of req.files){
            images.push(image.filename)
        }

        const productData=req.body
        const product=await Product.findById(req.body.id)
        if(!product){
            res.json({message:"This product doesn't exist",updated:false})

        }else if(!(productData.name&&productData.description&&productData.category.length&&productData.brand&&productData.stock&&productData.price&&productData.size&&productData.color)){
            res.json({message:'please provide all general informations',updated:false})
        }else if(isNaN(productData.stock) || Number(productData.stock)<0){
                res.json({message:'Invalid stock information',updated:false})
        }else if(isNaN(productData.price) || Number(productData.price)<0){
            res.json({message:'Invalid price information',updated:false})
        }else if(!images.length){
            res.json({message:'Please provide atlease one image',updated:false})
        }else{
            req.productData={
                name:productData.name,
                size:productData.size,
                description:productData.description,
                category:productData.category,
                stock:productData.stock,
                color:productData.color,
                price:productData.price,
                lastModified:Date.now(),
                brand:productData.brand,
                careInstructions:productData?.careInstructions,
                material:productData?.material,
                additionalSpecifications:productData?.additionalSpecifications,
                images:images
            }
            next()
        }

})

const validateBrandData =asyncErrorHandler( async(req,res,next)=>{
    

    const name=req.body.name
    const description=req.body.description
    const logo=req.file?.filename
    
    
    if(name&& description&& logo){
        const check=await Brand.findOne({name:name})
      
        if(check){
            console.log("This brand already exist")
            res.json({message:"This brand already exist"})


        }else{
            
            req.brandData={
                name:name,
                description:description,
                logo:logo
            }
            next()
        }


    }else{
        res.json({message:"Please fill all the fealds"})
    }


})


 const validateUpdatedBrandData=asyncErrorHandler( async(req,res,next)=>{
    

    const name=req.body.name;
    const description=req.body.description
    const logo=req.file?.filename
    const id=req.body.id

    if(name&&description){

        const brand=await Brand.findById(id)
        const originalbrandData = { ...brand._doc };

        const brandCheckByName=await Brand.findOne({name:name})
    

        if(brandCheckByName && !brand._id.equals(brandCheckByName._id)){
            res.json({message:"This name has already stored as a seperate brand"})
        }else{
            
        if(req.file?.filename){

            req.originalbrandData=originalbrandData
           
                    req.brandData={
                        name:name,
                        description:description,
                        logo:logo
                    }
                    next()
                   
        
        }else{
            
            req.brandData={
                name:name,
                description:description,
            }
            next()

        }

        }

    }else{
        res.json({message:"Please provide all informations"})
    }
        
})

const sanitiseSalesReportParam=(req,res,next)=>{
    try {
        
        const{timePeriod}=req.query;
       
            if(timePeriod &&['month','year','week'].includes(timePeriod)){
                if(timePeriod=='week'){

                    // Calculate the start and end dates for the current week
                    const currentDate = new Date();
                    const currentWeekStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
                    const currentWeekEndDate = new Date(currentWeekStartDate);
                    currentWeekEndDate.setDate(currentWeekEndDate.getDate() + 6);

                    // Calculate the start and end dates for the last week
                    const lastWeekStartDate = new Date(currentWeekStartDate);
                    lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7);
                    const lastWeekEndDate = new Date(currentWeekEndDate);
                    lastWeekEndDate.setDate(lastWeekEndDate.getDate() - 7);
                    req.current={
                        startDate:currentWeekStartDate,
                        endDate:currentWeekEndDate
                    }
                    req.previous={
                        startDate:lastWeekStartDate,
                        endDate:lastWeekEndDate
                    }

                }else if(timePeriod=='month'){
                    // Calculate the start and end dates for the current month
                    const currentDate = new Date();
                    const currentMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    const currentMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

                    // Calculate the start and end dates for the last month
                    const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    const lastMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                    req.current={
                        startDate:currentMonthStartDate,
                        endDate:currentMonthEndDate
                    }
                    req.previous={
                        startDate:lastMonthStartDate,
                        endDate:lastMonthEndDate
                    }
                    }else{
                    // Calculate the start and end dates for the current year
                    const currentDate = new Date();
                    const currentYearStartDate = new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0); // January 1st
                    const currentYearEndDate = new Date(currentDate.getFullYear() + 1, 0, 0, 23, 59, 59); // December 31st

                    // Calculate the start and end dates for the last year
                    const lastYearStartDate = new Date(currentYearStartDate);
                    lastYearStartDate.setFullYear(lastYearStartDate.getFullYear() - 1);
                    const lastYearEndDate = new Date(currentYearEndDate);
                    lastYearEndDate.setFullYear(lastYearEndDate.getFullYear() - 1);


                        req.current={
                            startDate:currentYearStartDate,
                            endDate:currentYearEndDate
                        }
                        req.previous={
                            startDate:lastYearStartDate,
                            endDate:lastYearEndDate
                        }
                    }
                req.timePeriod=timePeriod
                next()
            }else{
            res.json({message:'Invalid timePeriod'})
            }
    } catch (error) {
        next(error)
    }
}

const validateCoupone=asyncErrorHandler( async (req,res,next)=>{

    const{expireDate,startDate,couponeDiscount,maxPurchaseAmount,minPurchaseAmount,couponeCode,quantity}=req.body
    if(!adminHelpers.isValidCouponCode(couponeCode) || !adminHelpers.isValidAmount(maxPurchaseAmount) || !adminHelpers.isValidAmount(quantity) || !adminHelpers.isValidAmount(minPurchaseAmount) || !adminHelpers.isValidDiscount(couponeDiscount) || !adminHelpers.isValidDate(startDate) || !adminHelpers.isValidDate(expireDate)){
        res.json({message:'Invalid form data'})
    }else if(Number(maxPurchaseAmount)<=Number(minPurchaseAmount)){
        res.json({message:'maximum amount should be greater than minimum amount'})
    }else if(startDate>expireDate){
        res.json({message:'Start date must be before the expire date'})
    }else if(await adminHelpers.doesCouponeCodeTake(couponeCode,req.body?.couponeId)){
        res.json({created:false,message:'This coupone code already exist'})
    }else{
        req.coupone={
            couponeCode:couponeCode,
            minPurchaseAmount:minPurchaseAmount,
            maxPurchaseAmount:maxPurchaseAmount,
            couponeDiscount:couponeDiscount,
            startDate:startDate,
            expireDate:expireDate,
            quantity:quantity
        }
        next()
    }

})

const validateOfferData=(req,res,next)=>{
    try {
        const{expireDate,startDate,discountPercentage,name}=req.body
        if(!name || !adminHelpers.isValidDiscount(discountPercentage) || !adminHelpers.isValidDate(startDate) || !adminHelpers.isValidDate(expireDate)){
            res.json({message:'Invalid form data'})
        }else if(startDate>expireDate){
            res.json({message:'Start date must be before the expire date'})
        }else{
            req.offer={
                name:name,
                discountPercentage:discountPercentage,
                startDate:startDate,
                expireDate:expireDate
            }
            next()
        }

    } catch (error) {
        next(error)
    }
}

const orderUpdation=(req,res,next)=>{
    try {
        const {newStatus}=req.body
        const order=req.order
    
        if(['Pending', 'Processing', 'Shipped', 'Delivered','Canceled'].includes(newStatus)){
    
            if(order.orderStatus!==newStatus){
    
                next()
            }else{
                const err= new CustomError('Invalid request',400)
                next(err)
            }
        }else{
            
            const err= new CustomError('Invalid new order Status',400)
                next(err)
        }
    } catch (error) {
        next(error)
    }
   
}

const returnStatus=async(req,res,next)=>{
   
    const {newReturnStatus,productId}=req.body
    const order=req.order
   
    if(['returnPlaced','outForPick','returned'].includes(newReturnStatus)){
      
        for(let i=0;i< order.items.length;i++){
            if(order.items[i].product==productId){
                if(order.items[i].orderStatus=='Delivered' && order.items[i].returnStatus!=newReturnStatus && order.items[i].returnStatus!='returned'){
           
                    req.productIndex=i
                    next()
                    return
                }
            }
        }

        const err= new CustomError('Invalid request',400)
                next(err)

    }else{
       
        const err= new CustomError('Invalid new order return Status',400)
        next(err)
    }
}

const banner=asyncErrorHandler( async(req,res,next)=>{

    const {miniTitle,mainTitle,description,link} =req.body
    const bannerBackground=req.file?.filename
    if(!miniTitle || !mainTitle || !description || !link || !bannerBackground){

        //DELETE NEWLY ADDED IMAGE
        const url=path.join(__dirname,'..','public','bannerBackground')
        const deleted=adminHelpers.deleteFile(url)

        res.json({success:false,message:'Please provide all informations'})
        return

    }else{
        req.bannerData={
            miniTitle:miniTitle,
            mainTitle:mainTitle,
            description:description,
            link:link,
            bannerBackground:bannerBackground
        }
        next()
    }

})


module.exports={
validateProductDatas,
 validateBrandData,
 validateUpdatedBrandData,
 sanitiseSalesReportParam,
 validateCoupone,
 validateOfferData,
 orderUpdation,
 returnStatus,
 banner
}