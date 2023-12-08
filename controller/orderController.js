const Order=require('../model/orderModel')
const User=require('../model/userModel')
const Product=require('../model/productModel')
const userHelpers=require('../helperMethods/userHelpers')
const crypto=require('crypto')
const { default: mongoose } = require('mongoose')
const puppeteer=require('puppeteer')
const asyncErrorHandler=require('../Utils/asyncErrorHandler')
const { aggregate } = require('../model/brandModel')
const CustomError = require('../Utils/CustomError')
const { order } = require('../middleware/checkExist')


const loadOrders=asyncErrorHandler( async(req,res,next)=>{

        const user=req.user

        const page=req.query.page||1// specifies which page
        const pagesize=req.query.pageSize||5//specifies how much data page contains

        const offset=(page-1)*pagesize//specifies how much data to be skipped
        const limit=pagesize//specifies how much data needed
        
        
        const orderData = await Order.find({customer:req.session.userId})
        .sort({updatedAt:-1}).skip(offset).limit(limit)
        .populate({
          path: 'items.product',
          select: 'color images name size',
          populate: {
            path: 'brand',
            select: 'name',
          },
        });
    

        const totalOrdes=(await Order.find({customer:req.session.userId})).length
        const totalpages=Math.ceil(totalOrdes/pagesize)
        
        
        res.render('orders',{orderData:orderData,user:user,currentPage:page,totalpages:totalpages})

});

const loadOrderDetails=asyncErrorHandler( async(req,res,next)=>{

    const user=req.user
    
    const orderData = await Order.findOne({_id:req.query.orderId,customer:req.session.userId,items:{$elemMatch:{product:req.query.productId}}})
    .populate({
        path: 'items.product',
        match: { _id: req.query.productId } // This matches the specific product by its _id
      })
      
      let selectedProduct
      for(let item of orderData.items){
        if(item.product){
            selectedProduct=item
        }
      }
      // return
      orderData.items=selectedProduct
      if(orderData){
        
        res.render('orderDetails',{orderData:orderData,user:user})
      }else{
        const err=new CustomError('Order not found',404)
        next(err)
    
      }
})


const cancelOrder=asyncErrorHandler( async(req,res, next)=>{

    const orderData=req.order

      for(let item of orderData.items){
        //finding which product to be canceled
        if(item.product==req.body.productId){
          if(['Pending','Processing','Shipped'].includes(item.orderStatus)){
            
            item.orderStatus='Canceled';
            item.canceledByUser=true

            if(orderData.paymentMethod!=='COD' && item.paymentStatus=='received'){
              item.paymentStatus='refunded'

              const check=await userHelpers.checkRefundEligible(item,orderData)
              // if not eligible for single product cancelation  inform user 
              if(!check.eligible){
                res.json({canceled:false,singleCancelNotEligible:true,message:`We understand that you'd like to cancel an individual item from your order, but  doing so would make the remaining items ineligible for the applied discount coupon. If you still want to cancel this item,<mark> you'll need to cancel the entire order and place a new one with the desired items.</mark> We apologize for any inconvenience this may cause and appreciate your understanding.`})
                
                return
              }

              //if eligible refunding to wallet
              const amount=check.amount
              const transactionId=crypto.randomBytes(8).toString('hex')

              await userHelpers.addMoneyToWallet(req.session.userId,amount,transactionId,'Order refunded')
   
             }
             userHelpers.setNewOrderTotal(item,orderData)
             
            const orderCanceled =await orderData.save()

            if(orderCanceled){

                await Product.updateOne({_id:req.body.productId},{$inc:{stock:item.quantity}})
                res.json({message:'order canceled successfully',canceled:true})
            }else{
              const err=CustomError('Order cancelation failed',500)
              next(err)
            }

          }else{
            
            const err=new CustomError('Invalid cancel request',400)
            next(err)
          }
 

        }
      }

})

// const singleCancelNotEligible=async(req,res)=>{
//   try {
//     console.log('singleCancelNotEligible')
//     const {productId,orderId}=req.query
//     console.log('productId',productId,'orderId',orderId)
    
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({message:'Internal server error'})
//   }
// }

const orderItems=asyncErrorHandler( async(req,res, next)=>{

    const {orderId}=req.query
  
    const orderData = await Order.findOne({customer:req.session.userId,_id:orderId})
    .populate({
      path: 'items.product',
      select: 'color images name size',
      populate: {
        path: 'brand',
        select: 'name',
      },
    });
    
    if(orderData){
      res.json({orderData:orderData})

    }else{
      const err=new CustomError("This order doesn't exist",400)
      next(err)
    }

});

const cancenlWholeOrder=asyncErrorHandler( async(req,res, next)=>{

    const order=req.order
    let refundAmount=order.totalAmount;
    let total=0
    //IF PAYMENT METHOD IS COD 
    if(order.paymentMethod=='COD'){
      const err=new CustomError('invalid cancel request',400)
      return next(err)
    }

    //CANCELING AND RELEASING ALL ORDER PRODUCTS
    for(let item of order.items){

      if(item.orderStatus!=='received'){
        
        item.orderStatus='Canceled';
        item.canceledByUser=true
        item.paymentStatus='refunded'

        
          
        const orderCanceled =await order.save()

        if(orderCanceled){
            await Product.updateOne({_id:item.product},{$inc:{stock:item.quantity}})
        }
      }else{
        refundAmount-=item.price
        total+=item.price
      }
    }

    refundAmount=(refundAmount<0?0:refundAmount).toFixed(2)
    
    order.totalAmount=(order.totalAmount-refundAmount).toFixed(2)
    await order.save()

    //REFUNDING TO USER WALLET
    const transactionId=crypto.randomBytes(8).toString('hex')
    await userHelpers.addMoneyToWallet(req.session.userId,refundAmount,transactionId,'Entire Order refunded')

    res.json({canceled:true,message:'Your order has been successfully canceled. We appreciate your understanding.'})

});

const downloadInvoice=asyncErrorHandler( async(req,res)=>{
  
    const oredr=req.order;
    const invoiceHTML= userHelpers.generateInvoice(oredr)
    
    // Launch Puppeteer and generate a PDF
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(invoiceHTML);
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Close the Puppeteer browser
    await browser.close();

    // Send the PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${req.query.orderId}.pdf`);
    res.send(pdfBuffer);
    

});

//RETURN ORDER
const returnOrder=asyncErrorHandler( async(req,res)=>{

    const order=req.order 
    
    const {productId,returnReason}=req.body;

    for(let item of order.items){
      if(item.product==productId && item.orderStatus=='Delivered'){
        

        item.returnStatus='returnPlaced'
        const eligibleForReturn=await  userHelpers.eligibleForReturn(item,order)
        
        item.eligibleForReturn=eligibleForReturn
        item.returnReason=returnReason

        const placed=await order.save()
        if(placed){
         
            res.json({success:true,message:"Thank you for providing the reason. We will review your request shortly."})
        }else{

          const err=new CustomError('Return request has been failed',500)
          next(err)

        }

      }
    }

});

const loadReview=asyncErrorHandler( async(req, res, next)=>{
  
    const order=req.order
    res.render('review',{order:order,userId:req.session.userId,user:true})
});

const addRating=asyncErrorHandler( async(req, res, next)=>{
    
    let rated
    const order = req.order;
    const ratings = order.productDetails.rating;

    // product rating and review
    const { rating, review, productId } = req.body;

    //CHECK PRODUCT ALREADY REVIEWED
    const existingReviewIndex = ratings.findIndex(
      (r) => r.userId?.equals(new mongoose.Types.ObjectId(req.session.userId))
    );

    //CREATE NEW REVIEW DATA
    const newRating = {
      value: rating,
      review: review.trim(),
      userId:req.session.userId

    };
    //IF ALREADY EXIST UPDATE IT
    if (existingReviewIndex !== -1) {
      rated=await Product.updateOne({ _id: productId }, { $set: { [`rating.${existingReviewIndex}`]: newRating } });
    } else {
      // ADD NEW
      rated=await Product.updateOne({ _id: productId }, {$push:{rating:newRating}});
    }

    //CHECK UPDATED?
    if(rated.modifiedCount!==1){
      const err=new CustomError('unable to add review',500)
      return next(err)
    }
    res.json({success:true,message:"Thank you so much. Your review has been saved"})

})


module.exports={
    loadOrders,
    loadOrderDetails,
    cancelOrder,
    // singleCancelNotEligible,
    orderItems,
    cancenlWholeOrder,
    downloadInvoice,
    returnOrder,

    loadReview,
    addRating
}