const User=require('../model/userModel')
const Address=require('../model/addressModel')
const Product=require('../model/productModel')
const Cart=require('../model/cartModel')
const Order=require('../model/orderModel')
const userHelpers=require('../helperMethods/userHelpers')
const { default: mongoose } = require('mongoose')
const crypto=require('crypto')
const Coupone = require('../model/couponeModel')


const checkout=async(req,res)=>{
    try {
        //----------------------------validate quantity---------------------------------
        
        const user=await User.findById(req.session.userId)
        const addresses=await Address.find({user:req.session.userId})
        const currentDate=new Date()
        const coupons = await Coupone.find({
            status: true,
            expireDate: { $gt: currentDate },
            startDate: { $lte: currentDate },
            $or: [
                { appliedUsers: { $size: 0 } }, // Check if the array is empty
                { appliedUsers: { $ne: req.session.userId } } // Check if the user is not in the array
            ]
        });
    console.log(coupons)
     if(req.query.productId){

        const product=await Product.findById(req.query.productId).populate('brand')
        if(product.stock>=req.query.quantity){
           
            res.render('checkout',{user:user,addresses:addresses,product:product,quantity:req.query.quantity,coupones:coupons})
        }else{
            res.json({message:`Sorry, we can't provide the requested quantity of "${product.name}" as we have ${product.stock} units in stock.`,byuNowAvailable:false})
        }
        
     }else{
        const cart = await Cart.findOne({ user:req.session.userId })
        .populate({
          path: 'cartItems.product',
          select: 'name images brand color effectedDiscount',
          populate: {
            path: 'brand',
            select: 'name' 
          }
        });
console.log(cart.cartItems[0].product.effectedDiscount)
        res.render('checkout',{user:user,addresses:addresses,cart:cart,coupones:coupons}) 
     }
        

       
    } catch (error) {
        console.log(error)
        res.status(500).render('errors/500.ejs')
    }
}




const confirmOrder=async(req,res)=>{
    try {
        
        
        // console.log(req.order)
        const order=new Order(req.order)
        const orderData=await order.save()
        if(orderData){

            if(req.body['paymentMethod']=='COD'){
                await userHelpers.releaseProducts(req.order,req.cart,req.session.userId)
                if(req.coupone){
        
                    await userHelpers.setCouponeApplied(req.coupone._id,req.session.userId)
                }
                res.json({orderConfirmed:true,order:orderData._id,cod:true})
            }else if(req.body['paymentMethod']=='ONLINE-PAYMENT'){
                const userInfo = await User.aggregate([
                    {
                      $match: {
                        _id: new mongoose.Types.ObjectId(req.session.userId), // Convert the userId to ObjectId
                      },
                    },
                    {
                      $project: {
                        _id: 0,
                        name: { $concat: ['$fname', ' ', '$lname'] },
                        email: 1,
                        mobile: 1,
                      },
                    },
                  ]);
              
                userHelpers.generateRazorpay(orderData._id,orderData.totalAmount.toFixed(2)).then(order=>{
                    const cart=req.cart?true:false;
                       
                        res.json({orderConfirmed:true,order:order,cod:false,userInfo:userInfo[0],cart:cart})
                })
            }else if(req.body['paymentMethod']=='WALLET'){

                const id=crypto.randomBytes(8).toString('hex')
                const debited=await userHelpers.debitFromWallet(req.session.userId,req.order.totalAmount,id,'Product purchased')
                if(debited){
                    userHelpers.changepaymentStatus(orderData._id,'received')
                    await userHelpers.releaseProducts(req.order,req.cart,req.session.userId)
                    if(req.coupone){
                        await userHelpers.setCouponeApplied(req.coupone._id,req.session.userId)
                    }
                    res.json({orderConfirmed:true,order:orderData._id,wallet:true})
                }else{
                    res.json({orderConfirmed:false,wallet:true,message:'Insufficient balance in your wallet'})
                }
               
            }
            
        }else{
            res.json({message:'order confirmed',orderConfirmed:false})
        }
        
        
    } catch (error) {
        console.log(error)
        res.status(500).render('errors/500.ejs')
    }
}

const orderResponse=async(req,res)=>{
    try {
        if(req.query.order){
        const user=await User.findById(req.session.userId)

            const orderData = await Order.findById(req.query.order)
            .populate({
              path: 'items.product',
              select: 'color images name size ',
              populate: {
                path: 'brand',
                select: 'name',
              },
            });


            res.render('orderResponse',{orderData:orderData,user:user})
        }

    } catch (error) {
        console.log(error)
        res.status(500).render('errors/500.ejs')
        
    }
    
}
const verifyPayment=async(req,res)=>{
    try {
        
        const details=req.body;
       
        let hmac=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        hmac.update(details.payment?.razorpay_order_id+'|'+details.payment?.razorpay_payment_id)
        hmac=hmac.digest('hex')
        if(hmac==details.payment?.razorpay_signature){
            
            const result=await userHelpers.changepaymentStatus(details.order.receipt,'received',null)
            if(result){
                const order=await Order.findById(details.order.receipt)
                await userHelpers.releaseProducts(order,details.cart,req.session.userId)
                if(order.couponeId){
                    await userHelpers.setCouponeApplied(order.couponeId,req.session.userId)
                }
                res.json({paied:true,orderId:details.order.receipt})
            }else{
                res.json({mesaage:'payment failed',paied:false})
            }
            
        }else{
            
            res.json({mesaage:'payment failed',paied:false})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}

const getCoupone=async (req,res)=>{
    try {
        
        const coupone=req.coupone
        if(coupone){
            res.json({coupone:coupone})
        }else{
            res.json({message:"Coupone doesn't exist",coupone:false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}





module.exports={
    checkout,
    confirmOrder,
    orderResponse,
    verifyPayment,
    getCoupone
}