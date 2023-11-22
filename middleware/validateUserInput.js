const Product=require('../model/productModel')
const Cart=require('../model/cartModel')
const User=require('../model/userModel')
const Address=require('../model/addressModel')
const orderManagement=require('../middleware/orderManagement')
const Order=require('../model/orderModel')
const mongoose=require('mongoose')
const Coupone = require('../model/couponeModel')

const validateCartInputs=async (req,res,next)=>{
    const userId=req.session.userId;

    const productId=req.body.productId;
    const productQuantity=parseInt(req.body.quantity);
    const price=req.body.price

    //const expiryTime = 24 * 60 * 60 * 1000;  //24 hours in milliseconds
    // const expiryTime = 60 *1000;  //24 hours in milliseconds 

   // const cartExpirationTime = new Date(Date.now() + expiryTime); // Set the cart expiration time

    if(!productId || isNaN(productQuantity) || isNaN(price) || parseInt(productQuantity)<1 || parseInt(price)<1 ){
        res.json({message:'Invalide Information'})
    }else{

        const product=await Product.findById(productId)
        if(!product){
            res.json({message:'product not fount'})
        }else if(product.stock<productQuantity){
            res.json({message:'Sorry, the requested quantity exceeds our current stock.'})
        }else{
            req.newCart={
                user:userId,
                cartItems:[
                    {
                        product:productId,
                        quantity:productQuantity,
                        price:price,
                        
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
    console.log(error.message)
    res.status(500).json({message:'internal server error'})
   
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
        console.log('error')
        res.status(500)
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

const validateCheckoutData=async(req,res,next)=>{
        try {
            console.log('###########')
         
            const address=await Address.findById(req.body?.address)
            if(address){
                if(req.body.productId){
                    const product=await Product.findById(req.body.productId)
                    if(product){
                        if(product.stock>=req.body.productQty){
                            if(req.body.paymentMethod=='COD' ||req.body.paymentMethod=='ONLINE-PAYMENT' || req.body.paymentMethod=='WALLET'){

                                const lastOrderNumber= await orderManagement.getLastOrderNumber()

                                const orderNumber=orderManagement.generateOrderNumber(lastOrderNumber)
                                    const totalAmount=product.price*req.body.productQty
                                    req.order={
                                        orderNumber:orderNumber,
                                        customer:req.session.userId,
                                        items:[{
                                            product:product._id,
                                            quantity:req.body.productQty,
                                            price:product.price
                                        }],
                                        totalAmount:totalAmount,
                                        paymentMethod:req.body.paymentMethod,
                                        // orderStatus:'Pending',
                                        shippingAddress:address,
                                    }
                                    next()

                            }else{
                                res.json({message:"Invalid payment method",orderConfirmed:false})
                            }


                        }else{
                            res.json({message:"Ths specified amount of quantity for this poduct is not available",orderConfirmed:false})
                        }

                    }else{
                        res.json({message:"This product  doesn't exist",orderConfirmed:false})
                    }
                    //for confirm order for cart
                }else{
                    const cart=await Cart.findOne({user:req.session.userId})
                    if(cart && cart?.cartItems?.length>0 ){

                        if(!(req.body.paymentMethod=='COD' ||req.body.paymentMethod=='ONLINE-PAYMENT' || req.body.paymentMethod=='WALLET')){
                            res.json({message:"Invalid payment method",orderConfirmed:false})
                        }else{

                            let productInfos=[];
                            let totalAmount=0
                            let instock=true;
                            for(let item of cart.cartItems){
                                const product=await Product.findById(item.product)
                                if(!(product && item.quantity<=product.stock)){
                                    instock=false
                                }
                                totalAmount+=item.quantity*item.price
                                productInfos.push({
                                    product:item.product,
                                    quantity:item.quantity,
                                    price:item.price
                                })
                            }
                            if(instock){
                                const lastOrderNumber= await orderManagement.getLastOrderNumber()
                                const orderNumber=orderManagement.generateOrderNumber(lastOrderNumber)
                              
                                req.cart=true
                                req.order={
                                    orderNumber:orderNumber,
                                    customer:req.session.userId,
                                    items:productInfos,
                                    totalAmount:totalAmount,
                                    paymentMethod:req.body.paymentMethod,
                                    // orderStatus:'Pending',
                                    shippingAddress:address,
                                }
                                next()
                            }else{
                                res.json({message:"Ths specified amount of quantity for this poduct is not available",orderConfirmed:false})
                            }


                        }
                       

                    }else{
                        res.json({message:"The user has no active cart",orderConfirmed:false})
                    }


                }

            }else{
                res.json({message:"This address doesn't exist",orderConfirmed:false})
            }
             
        } catch (error) {
            console.log(error)
            res.status(500).json({message:'internal server error'})
            
        }
}

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
            console.log(error)
            res.status(500).json({message:'internal server error'})
        }
}

const validateProductSearchCriteria=async(req,res,next)=>{
    try {
        
        const { name, categories, brands, priceRange={}, page=1, pageSize=12,sort='default'} = req.body;
        

        
        
        

        let matchCriteria={};
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

        
    } catch (error) {
        console.log(error)
    }
}

const coupone=async(req,res,next)=>{
    try {
        const coupone=req.coupone
        const {total}=req.body
        const currentDate=new Date()
        if((!new Date(coupone.expireDate)>currentDate) || !(new Date(coupone.startDate)<=currentDate) || (!coupone.status)){
    
            res.json({coupone:false,message:'Invalid coupone'})
        }else if(!total>coupone.minPurchaseAmount){
            res.json({coupone:false,message:"coupone can't be applied due to insufficient purchase amount "})
        }else if(!(total<coupone.maxPurchaseAmount)){
            console.log(!(total<coupone.maxPurchaseAmount),total,coupone.maxPurchaseAmount)
            res.json({coupone:false,message:"coupone can't be applied due to exceding of  purchase limit "})
            
        }else{
            next()
        }
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
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
    coupone
    
}