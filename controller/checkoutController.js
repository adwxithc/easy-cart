const User=require('../model/userModel')
const Address=require('../model/addressModel')
const Product=require('../model/productModel')
const Cart=require('../model/cartModel')
const Order=require('../model/orderModel')
const userHelpers=require('../helperMethods/userHelpers')
const { default: mongoose } = require('mongoose')
const crypto=require('crypto')
const Coupone = require('../model/couponeModel')
const asyncErrorHandler=require('../Utils/asyncErrorHandler')
const CustomError = require('../Utils/CustomError')


const checkout=asyncErrorHandler( async(req,res, next)=>{

        //----------------------------validate quantity---------------------------------
        
        const user=req.user
        const addresses=await Address.find({user:req.session.userId})
        const currentDate=new Date()

        const coupons = await Coupone.find({
            status: true,
            expireDate: { $gt: currentDate },
            startDate: { $lte: currentDate },
            $or: [
                { appliedUsers: { $size: 0 } }, // Check if the array is empty
                {
                    $and: [
                        {
                            $expr: {
                                $lt: [ { $size: "$appliedUsers" }, "$quantity" ] // Check if the number of applied users is less than quantity
                            }
                        },
                        { appliedUsers: { $ne: req.session.userId } } // Check if the user is not in the array
                    ]
                }
            ]
        });
        
        
    
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

        res.render('checkout',{user:user,addresses:addresses,cart:cart,coupones:coupons}) 
     }
        

})




const confirmOrder=asyncErrorHandler( async(req,res, next)=>{

        
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
        

});

const orderResponse=asyncErrorHandler( async(req,res, next)=>{

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


    
})
const verifyPayment=asyncErrorHandler( async(req,res, next)=>{

        const details=req.body;
        
        let hmac=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        hmac.update(details.payment?.razorpay_order_id+'|'+details.payment?.razorpay_payment_id)
        hmac=hmac.digest('hex')
        if(hmac==details.payment?.razorpay_signature){

            const order=await Order.findById(details.order.receipt)

            const haveStock= await userHelpers.haveStock(order)
            if(!haveStock){
                const transactionId=crypto.randomBytes(8).toString('hex')
                userHelpers.addMoneyToWallet(req.session.userId, order.totalAmount, transactionId, 'item  purchased has out of stock.  the full amount you paid has been promptly refunded and credited back to your wallet.')

                return res.json({success:false,message:'We regret to inform you that the item you purchased is currently out of stock. We sincerely apologize for any inconvenience this may have caused. The full amount you paid has been promptly refunded and credited back to your wallet.'})
            }

            const result=await userHelpers.changepaymentStatus(details.order.receipt,'received',null)
            if(result){
                
                await userHelpers.releaseProducts(order,details.cart,req.session.userId)
                if(order.couponeId){
                    await userHelpers.setCouponeApplied(order.couponeId,req.session.userId)
                }
                res.json({paied:true,orderId:details.order.receipt})
            }else{
                
                const err=new CustomError('payment failed',500)
                next(err)
            }
            
        }else{
            const err= new CustomError('Invalid verification request',400)
            next(err)
            
        }

})

const getCoupone=asyncErrorHandler( async (req,res, next)=>{

        const coupone=req.coupone
        if(coupone){
            res.json({coupone:coupone})
        }else{
            res.json({message:"Coupone doesn't exist",coupone:false})
        }

})





module.exports={
    checkout,
    confirmOrder,
    orderResponse,
    verifyPayment,
    getCoupone
}