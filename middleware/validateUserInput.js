const Product=require('../model/productModel')
const Cart=require('../model/cartModel')
const User=require('../model/userModel')
const Address=require('../model/addressModel')
const orderManagement=require('../middleware/orderManagement')
const Order=require('../model/orderModel')
const mongoose=require('mongoose')
const Coupone = require('../model/couponeModel')
const userHelpers=require('../helperMethods/userHelpers')
const CustomError = require('../Utils/CustomError')
const asyncErrorHandler= require('../Utils/asyncErrorHandler')

const validateCartInputs= (req,res,next)=>{
    const userId=req.session.userId;

    
    const product=req.product
    const productId=req.body.productId;
    const productQuantity=parseInt(req.body.quantity);
    // const price=req.body.price

    //const expiryTime = 24 * 60 * 60 * 1000;  //24 hours in milliseconds
    // const expiryTime = 60 *1000;  //24 hours in milliseconds 

   // const cartExpirationTime = new Date(Date.now() + expiryTime); // Set the cart expiration time

    if(!productId || isNaN(productQuantity)|| parseInt(productQuantity)<1  ){
        res.json({message:'Invalide Information'})
    }else{

        if(product.stock<productQuantity){
            res.json({message:'Sorry, the requested quantity exceeds our current stock.'})
        }else{
            req.newCart={
                user:userId,
                cartItems:[
                    {
                        product:productId,
                        quantity:productQuantity,
                        price:product.price,
                        
                    }
                ],
                
            }

            //it also have   ->cartExpiration:cartExpirationTime
            next()
        }

    }

}

const validateCartItemCount=async(req,res,next)=>{
try {

    const productId=req.body.productId
    const quantity=req.body.quantity
    const operation=req.body.operation
    const cart=await Cart.findOne({user:req.session.userId})

    if(cart){
       
        if(isNaN(quantity) || quantity<0){
            
            res.json({message:'Invalid quatity'})
        }else{

            req.item={
                productId:productId,
                quantity:quantity,
            
                operation:operation
            }
            next()
        }


    }else{
        res.json({message:'User has no active cart'})
    }
    
} catch (error) {
    next(error) 
}}

const validateEditedUserInfo=async(req,res,next)=>{
    try {
        
        const emailRegx=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const mobileRegx=/^\d{10}$/;

        if(req.body.fname==''||req.body.lname==''||req.body.email==''){
            
            res.json({message:'Please fill all necessary informations',updated:false})
        }else if(!emailRegx.test(req.body.email.trim())){
            
            res.json({message:'Invalid email format',updated:false})
        }else if(!mobileRegx.test(req.body.mobile.trim()) && req.body.mobile!='' ){
            
            res.json({message:'Invalid phone number format',updated:false})
        }else{
            const user=User.findOne({_id:{$ne:req.session.userId},email:req.body.email})
            if(user && user.name){
                res.json({message:'This email is already in use',updated:false})
            }else{
                next()
            }
           
            
        }
        
    } catch (error) {
        next(error)
    }
}

const validateAddress=(req,res,next)=>{
   
    
    const pinRegx=/^\d{6}$/;
    const phoneRegx=/^[6789]\d{9}$/;
    const nameRegx=/^[A-Za-z\s'-]+$/;
    
    if(!(req.body.fname&& req.body.mobile&&req.body.pincode&&req.body.locality&&req.body.area&&req.body.cdt&&req.body.state)){

        res.json({message:'please fill all required fealds',added:false})

    }else if(!pinRegx.test(req.body.pincode.trim())){

        res.json({message:'Invalid pincode',added:false})

    }else if(!phoneRegx.test(req.body.altPhone.trim()) && req.body.altPhone.trim()!=''){

        res.json({message:'Invalid alternative phone number',added:false})
        
    }else if(!nameRegx.test(req.body.fname.trim())){

        res.json({message:'Invalid  first name',added:false})

    }else if(!phoneRegx.test(req.body.mobile.trim())){

        res.json({message:'Invalid  mobile number',added:false})

    }else{
        req.address={
            user:req.session.userId,
            name:req.body.fname,
            mobile:req.body.mobile,
            pincode:req.body.pincode,
            locality:req.body.locality,
            area:req.body.area,
            city:req.body.cdt,
            state:req.body.state,
            alternatePhone:req.body.altPhone,
            landmark:req.body.landmark
        }
        next()
    }

}

const validateCheckoutData=asyncErrorHandler( async(req,res,next)=>{

            const address=await Address.findById(req.body?.address)
            if(address){
                if(req.body.productId){
                    const product=req.product
                    
                        if(product.stock>=req.body.productQty){
                            if(req.body.paymentMethod=='COD' ||req.body.paymentMethod=='ONLINE-PAYMENT' || req.body.paymentMethod=='WALLET'){

                                const lastOrderNumber= await orderManagement.getLastOrderNumber()

                                const orderNumber=orderManagement.generateOrderNumber(lastOrderNumber)
                                
                                const effectedDiscount=product.effectedDiscount?product.effectedDiscount:0;
                                const totalAmount=req.body.total
                                let couponeDiscount=0,couponeId=null
                                if(req.couponeApplied){

                                     const coupone=req.coupone
                                    couponeDiscount=coupone.couponeDiscount
                                    couponeId=coupone._id
                                }
                                
                                
                                const discountedTotal=totalAmount-((totalAmount*couponeDiscount)/100)
                                
                                    req.order={
                                        orderNumber:orderNumber,
                                        customer:req.session.userId,
                                        items:[{
                                            product:product._id,
                                            quantity:req.body.productQty,
                                            MRP:product.price,
                                            discount:effectedDiscount,
                                            price:totalAmount,
                                            
                                        }],
                                        totalAmount:discountedTotal,
                                        paymentMethod:req.body.paymentMethod,
                                        shippingAddress:address,
                                        couponeDiscount:couponeDiscount,
                                        couponeId:couponeId
                                    }
                                    next()

                            }else{
                                const err= new CustomError("Invalid payment method",400)
                                next(err)
                            }


                        }else{
                            res.json({message:"Ths specified amount of quantity for this poduct is not available",orderConfirmed:false})
                        }
                    //for confirm order for cart
                }else{
                    const cart=req.cart

                        if(!(req.body.paymentMethod=='COD' ||req.body.paymentMethod=='ONLINE-PAYMENT' || req.body.paymentMethod=='WALLET')){
                            const err= new CustomError("Invalid payment method",400)
                            next(err)
                           
                        }else{

                            let productInfos=[];
                            let totalAmount=req.body.total
                            let instock=true;
                            for(let item of cart.cartItems){
                                const product=await Product.findById(item.product)
                                if(!(product && item.quantity<=product.stock)){
                                    instock=false
                                }
                                productInfos.push({
                                    product:item.product,
                                    quantity:item.quantity,
                                    MRP:item.MRP,
                                    discount:item.effectedDiscount,
                                    price:item.price,
                                    
                                })
                            }
                            if(instock){
                                const lastOrderNumber= await orderManagement.getLastOrderNumber()
                                const orderNumber=orderManagement.generateOrderNumber(lastOrderNumber)
                              
                                let couponeDiscount=0,couponeId=null
                                if(req.couponeApplied){
                                    const coupone=req.coupone
                                    couponeDiscount=coupone.couponeDiscount
                                    couponeId=coupone._id
                                }
                                const discountedTotal=totalAmount-((totalAmount*couponeDiscount)/100)
                                console.log(coupone._id)
                                req.cart=true
                                req.order={
                                    orderNumber:orderNumber,
                                    customer:req.session.userId,
                                    items:productInfos,
                                    totalAmount:discountedTotal,
                                    paymentMethod:req.body.paymentMethod,
                                    couponeDiscount:couponeDiscount,
                                    couponeId:couponeId,
                                    shippingAddress:address,
                                }
                                next()
                            }else{
                                res.json({message:"Ths specified amount of quantity for this poduct is not available",orderConfirmed:false})
                            }


                        }



                }

            }else{
                const err= new CustomError("This address doesn't exist",400)
                next(err)
            }

})

const validateChangePassword=(req,res,next)=>{
        try {
            
            const currentPassword=req.body.cPassword;
            const newPassword=req.body.nPassword;
            const rePassword=req.body.rePassword;
        
            if(!(currentPassword && newPassword&&rePassword) ){
                res.json({message:'please provide all required informations'})
            }else if(newPassword.length<6){
                res.json({message:'Plese enter password with more than 6 characters'})
            }else if(newPassword!=rePassword){
                res.json({message:'you entered two diffrent new  passwords'})
            }else{
                next()
            }
        } catch (error) {
            next(error)
        }
}

const validateProductSearchCriteria=asyncErrorHandler( async(req,res,next)=>{

        const { name='', categories, brands, priceRange={}, page=1, pageSize=12,sort='default'} = req.body ;
        

        let matchCriteria={status:true};

        // Validate input parameters here
        if(name){
         matchCriteria.name = { $regex: new RegExp(`^${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}`, 'i') };
       
        }
       
        if (categories && categories.length > 0) {
            matchCriteria.category = { $in: categories.map(category => new mongoose.Types.ObjectId(category)) };
        }

        if (brands && brands.length>0) {
            matchCriteria.brand = { $in: brands.map(brand => new mongoose.Types.ObjectId(brand)) };
        }

        if (priceRange && priceRange.min && priceRange.max && !isNaN(priceRange.max) && !isNaN(priceRange.min)) {
            matchCriteria.price = { $gte: Number(priceRange.min), $lte: Number(priceRange.max) };
        }

        req.matchCriteria=matchCriteria

        const skip=(page-1)*pageSize//specifies how much data to be skipped
        const limit=pageSize//specifies how much data needed
        const totalProducts = await Product.countDocuments(matchCriteria);
        const totalPages=Math.ceil(totalProducts/pageSize)

        req.skip=skip;
        req.limit=limit;
        req.totalPages=totalPages;
        req.page=page

        req.sort = ['price-low-to-high', 'price-high-to-low', 'latest'].includes(sort) ? sort : null;
        next()

})

const coupone=async(req,res,next)=>{
    try {

        
        if(!req.couponeApplied){
            console.log('couponeApplied=false')
             next()
             return;
        }
        
        const coupone=req.coupone
        const {total}=req.body
        const currentDate=new Date()
        
            if((!new Date(coupone.expireDate)>currentDate) || !(new Date(coupone.startDate)<=currentDate) || (!coupone.status)){
        
                res.json({coupone:false,message:'Invalid coupone'})
            }else if(!(total>coupone.minPurchaseAmount)){
                
                res.json({coupone:false,message:"coupone can't be applied due to insufficient purchase amount "})
            }else if(!(total<coupone.maxPurchaseAmount)){
                console.log(!(total<coupone.maxPurchaseAmount),total,coupone.maxPurchaseAmount)
                res.json({coupone:false,message:"coupone can't be applied due to exceding of  purchase limit "})
                
            }else if(!(coupone.quantity>coupone.appliedUsers.length)){
                res.json({coupone:false,message:"This coupone has already reached it's limit"})

            }else{
                next()
            }

        
    } catch (error) {
        next(error)
    }
}

const returnOrder=(req,res,next)=>{
    try {
        const order=req.order 
        const {productId}=req.body

        for(let item of order.items){
            if(productId==item.product){
                if(!(item.orderStatus!=='Delivered' || item.returnStatus)){
                    next()
                    return
                }
            }
        }
        res.status(400).json({success:false,message:'Invalid request'})

    } catch (error) {
        next(error)
    }
}

const otp=(req,res,next)=>{
    try {
        const {otpWithTimestamp}=req.session
        if(otpWithTimestamp){
            const seconds=Number(req.session?.otpWithTimestamp?.split(':')[1])
            const expire=(seconds+120)
            const isNotExpired =userHelpers.verifyOTP(req.session.otpWithTimestamp)
            if(isNotExpired){
                const otp = otpWithTimestamp.split(':')[0];
                if(otp==req.body.otp){

                next()

                }else{
                    
                    res.render('login-register/otp',{message:"Invalid OTP",title:'otp',expire:expire})
                }
            }else{
                console.log("otp expired")
                res.render('login-register/otp',{message:"OTP has expired please resend OTP",title:'otp',expire:expire})

            }
        }else{
            res.redirect('/register')

        }
        
        
    } catch (error) {
        next(error)
    }
}



 
 


module.exports={
    validateCartInputs,
    validateCartItemCount,
    validateEditedUserInfo,
    validateAddress,
    validateCheckoutData,
    validateChangePassword,
    validateProductSearchCriteria,
    coupone,
    returnOrder,
    otp,
    
    
    
}