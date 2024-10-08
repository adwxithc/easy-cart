const Razorpay = require('razorpay');
const Order=require('../model/orderModel')
const User=require('../model/userModel')
const Cart=require('../model/cartModel')
const Product=require('../model/productModel')
const Coupone=require('../model/couponeModel');
const nodemailer=require('nodemailer')

require('dotenv/config')


const bcrypt =require('bcrypt')

var instance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

const generateRazorpay=(orderId,amount)=>{
  try {
    return new Promise((resolve,reject)=>{
      let options={
        amount: amount*100,
        currency: "INR",
        receipt: orderId,
      }
      instance.orders.create(options,function(err,order){
        
        resolve(order)
      })
    })
  } catch (error) {
    throw error
  }


}

const changepaymentStatus=async(orderId,status,productId)=>{
    try {
      const order=await Order.findById(orderId)
      
      if(productId){
   
        for(let item of order.items){

          if(item.product==productId){
            item.paymentStatus=status
          }

        }
      }else{
        for(let item of order.items){

            item.paymentStatus=status
        }

      }

      const orderUpdated=await order.save()
      if(orderUpdated){
          return true
      }else{
        return new Error('changing OrderStatus failed')
      }
      
    } catch (error) {
      throw error
    }
}

// Verify an OTP and check if it has expired
function verifyOTP(otp, maxAgeInSeconds =120) {
  const otpTimestamp = otp.split(':')[1];
  const currentTime = Date.now() / 1000; // Convert to seconds
  const otpTime = parseFloat(otpTimestamp);

  if (otpTime + maxAgeInSeconds < currentTime) {
      // OTP has expired
      return false;
  }

  return true;


}



async function addMoneyToWallet(userId, amount, transactionId, description) {
    try {
        // Find the user by ID and update the wallet atomically
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $inc: { 'wallet.balance': amount }, // Increment the wallet balance
                $push: {
                    'wallet.transactions': {
                        type: 'credit',
                        amount: amount,
                        transaction_id: transactionId,
                        timestamp: Date.now(),
                        description: description,
                    },
                }, // Add a new transaction to the array
            },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
           
            return false;
        }

        return updatedUser
    } catch (error) {
        throw error
    }
}

async function debitFromWallet(userId,amount,transactionId,description){
  try {
    const user=await User.findById(userId)
  
    if(!user.wallet?.balance || user.wallet?.balance<amount){
     
        return false
    }else{

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
            $inc: { 'wallet.balance': -amount }, // decrement the wallet balance
            $push: {
                'wallet.transactions': {
                    type: 'debit',
                    amount: amount,
                    transaction_id: transactionId,
                    timestamp: Date.now(),
                    description: description,
                },
            }, // Add a new transaction to the array
        },
        { new: true } // Return the updated document
    );
    return updatedUser


    }
  } catch (error) {
    throw error
  }

    
}

async function releaseProducts(order,cart,userId){
  try {
    for(let item of order.items){
                
      await Product.updateOne({_id:item.product},{$inc:{stock:-item.quantity}})
    
  }

  if(cart){
      await Cart.deleteOne({user:userId})//checking the order is made on cart items if so empty the cart
  }
  } catch (error) {
    throw error
  }


}

async function findProducts(matchCriteria,skip,limit,sortCriteria){
  
    try {

      
      const aggregationPipeline=[{$match:matchCriteria}]

      if (Object.keys(sortCriteria).length > 0) {
        aggregationPipeline.push({ $sort: sortCriteria });
      }
      
      aggregationPipeline.push({$skip:skip},{$limit:limit})
      const product = await Product.aggregate(aggregationPipeline);
  
      if (product.length > 0) {

        return product
      } else {
        
        return false
      }
    } catch (error) {
      
      throw error
    }
  }
  
  async function checkRefundEligible(product,order){

    try {
      let discountedTotal,productPrice,discountPercentage,totalAmount,totalAmountAfterCancel

      // IF IT IS A ORDER FOR MULTIPLE PRODUCTS
      if(order.items.length>1){
        
  
         discountedTotal=order.totalAmount
        const {quantity,price}=product
         productPrice=quantity*price
  
         discountPercentage=order.couponeDiscount
         totalAmount=discountedTotal
  
         // IF COUPON HAS USED
         if(discountPercentage>0){
          totalAmount=discountedTotal / (1 - discountPercentage / 100);
          totalAmountAfterCancel=totalAmount-productPrice
  
          //finding the coupone
          const coupone=await Coupone.findById(order.couponeId)
  
          //if canceling not effecting minPurchaseAmount
          if(coupone.minPurchaseAmount<totalAmountAfterCancel){
            let newDiscountedTotal=totalAmountAfterCancel-((totalAmountAfterCancel*discountPercentage)/100)
            const refundAmount=discountedTotal-newDiscountedTotal
            return {eligible:true,amount:refundAmount}
          }else{
              return {eligible:false}
          }
         }else{
         
          return {eligible:true,amount:productPrice}
         }
         
         
  
         
      }else{
  
        
        return {eligible:true,amount:order.totalAmount}
      }
    } catch (error) {
      throw error
    }



  }

  const setCouponeApplied=async(couponId,userId)=>{

    try {

      const coupon = await Coupone.findOneAndUpdate(
        { _id: couponId },
        { $push: { appliedUsers: userId } },
        { new: true } 
      );

      if(coupon){
        return coupon
      }else{
        return false
      }
      
    } catch (error) {
      throw error
    }
    
  }

  const setNewOrderTotal=async(product,order)=>{
    try {
      let discountedTotal,productPrice,discountPercentage,totalAmount,totalAmountAfterCancel

      discountedTotal=order.totalAmount
      const {quantity,price}=product
       productPrice=quantity*price

       discountPercentage=order.couponeDiscount
       totalAmount=discountedTotal

       // IF COUPON HAS USED
       if(discountPercentage>0){
        totalAmount=discountedTotal / (1 - discountPercentage / 100);

       }
       //find new total amount
       totalAmount=totalAmount-productPrice

       //find its discounted total
       totalAmount=totalAmount-((totalAmount*discountPercentage)/100)
       order.totalAmount=totalAmount.toFixed(2)

      
    } catch (error) {
      throw error
    }
  }
  const generateInvoice=(order)=>{
      try {
        let items=``
        for(let item of order.items){
          if(item.paymentStatus!=='received') continue;
            const orderItem=`
            <tr>
            <td>${item.product.name}</td>
            <td>${item.product.description}</td>
            <td>Rs.${item.MRP}</td>
            <td>${item.quantity}</td>
            <td>${item.discount}%</td>
            <td>Rs.${item.price}</td>
            <td>Rs.${item.price*item.quantity}</td>
            </tr>
            `
            items+=orderItem

        }
        const invoiceHTML=`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
          
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 19px;
             
             
            }
            .outerLine{
              padding:1rem;
              border: 1px solid #ddd;
            }
        
            h1 {
              color: #333;
            }
        
            p {
              margin: 9px 0;
            }
        
            .invoice-details {
              margin-bottom: 20px;
            }
        
            .invoice-items {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
        
            .invoice-items th, .invoice-items td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
        
            .total , .discount {
              margin-top: 2px;
              display:flex;
              justify-content:end;
            }
            .title{
              display: flex;
              justify-content: center;
            }
            .address{
              padding:0.4rem;
              border:1px solid #ddd;
              display: flex;
              justify-content: space-between;
            }
            .mt{
              margin-top:5px
            }
            .end{
              border:1px dottem #ddd
            }
            .addr{
              padding-left:0.5rem;
              padding-right:0.5rem
            }
            .totalDetails{
           display: flex;
           justify-content: end;
            }
          </style>
        </head>
        <body>
          <div class='outerLine'>
          <div class='title'>
          <h1 ><u>Easy Cart</u></h1>
          </div>
        
          <h2>Order Invoice</h2>
        
          <div class="invoice-details">
            <p><strong>Order ID:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${order.createdAt}</p>
            <p><strong>Invoice Date:</strong> ${new Date()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        
        
            <!-- Add more details as needed -->
          </div>
        
          <div class="address">
        
            <div class='addr'>
                <h3>Shipping Address</h3>
                <div>
                    <div class=" mt"><span class=""><strong>${order.shippingAddress.name}</strong></span></div>
                    <div class="mt"> Phone:<span >${order.shippingAddress.mobile}</span></div>
                </div>
                <p class="p-1 infos">
                    ${ order.shippingAddress.area}, ${ order.shippingAddress.locality}, ${order.shippingAddress.city}, ${order.shippingAddress.state}-<span class="text-dark ">${order.shippingAddress.pincode}</span> 
                </p>
            </div>
        
            <div class='addr'>
            <h3>Billing Address</h3>
            <div>
                <div class=" mt"><span class=""><strong>${order.shippingAddress.name}</strong></span></div>
                <div class="mt"> Phone:<span >${order.shippingAddress.mobile}</span></div>
            </div>
            <p class="p-1 infos">
                ${ order.shippingAddress.area}, ${ order.shippingAddress.locality}, ${order.shippingAddress.city}, ${order.shippingAddress.state}-<span class="text-dark ">${order.shippingAddress.pincode}</span> 
            </p>
          </div>
        
          </div>
        
        
          <table class="invoice-items">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>MRP</th>
                <th>Quantity</th>
                <th>Discounts</th>
                <th>Unit Price</th>
        
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
        
            ${items}
        
            </tbody>
          </table>
          <div class="totalDetails">
        
          <div>
            <div class="discount">
                <p><strong>Total:</strong> Rs.${  (order.totalAmount / (1 - order.couponeDiscount / 100)).toFixed(2)}</p>
                </div>
              
                <div class="discount">
                <p><strong>Coupone discount:</strong> Rs.${  (((order.totalAmount / (1 - order.couponeDiscount / 100)).toFixed(2))-order.totalAmount).toFixed(2)}</p>
                </div>
              
                <div class="total end">
                  <p><strong>Total Amount:</strong>Rs. ${order.totalAmount}</p>
                </div>
          </div>
        
          </div>
        
          <script src="https://rawgit.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js"></script>
          <script>
            window.onload = function () {

                const element = document.body; // You can specify any HTML element here

                html2pdf(element);

                setTimeout(function () {
                    window.history.back();
                }, 1600);
            };
        </script>
        </body>
        </html>

        `
        return invoiceHTML
        
      } catch (error) {
        throw error
      }
  }

const eligibleForReturn=async(product,order)=>{
  try {
    let discountedTotal,productPrice,discountPercentage,totalAmount,totalAmountAfterReturn

    // IF IT IS A ORDER FOR MULTIPLE PRODUCTS AND COUPON HAS APPLIED
    if(order.items.length>1 && order.couponeDiscount>0){
      

       discountedTotal=order.totalAmount
       productPrice=product.quantity*product.price
       discountPercentage=order.couponeDiscount
       totalAmount=discountedTotal / (1 - discountPercentage / 100);
       totalAmountAfterReturn=totalAmount-productPrice

      //finding the coupone
      const coupone= await Coupone.findById(order.couponeId)


      //Check if canceling the product's return would violate the minimum purchase amount
      if(coupone.minPurchaseAmount>totalAmountAfterReturn){
        
        return false
      }
      
    }
    return true
  } catch (error) {
    throw error
  }

}

async function getMostSoldCategories(){
    try {
      const mostSoldCategories = await Order.aggregate([
        { $unwind: '$items' },
        {
          $match:{
            'items.orderStatus':'Delivered',
            'items.paymentStatus':'received'
          }
        }, // Flatten the array of items
        {
          $lookup: {
            from: 'products', // Adjust to the actual name of your Product collection
            localField: 'items.product',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        { $unwind: '$productDetails' },
        { $unwind: '$productDetails.category' }, // Unwind the array of categories

        { $group: { _id: '$productDetails.category', totalQuantitySold: { $sum: '$items.quantity' }, product: { $first: '$productDetails' } } }, // Group by category and calculate total quantity sold
        {
          $lookup: {
            from: 'categories', // Adjust to the actual name of your Category collection
            localField: '_id',
            foreignField: '_id',
            as: 'categoryDetails',
          },
        }, 
        {
          $match:{
            'categoryDetails.status':true
          }
        },
        { $sort: { totalQuantitySold: -1 } }, // Sort in descending order based on total quantity sold
        // { $limit: 6 },
// Limit to the first six categories
      ]);
      
      return mostSoldCategories
    } catch (error) {
      throw error
    }

}

const haveStock=async(order,userId)=>{
  try {
    for(let item of order.items){
                
      const product = await Product.findById(item.product)
      if(product.stock<item.quantity) return false
    }
    return true
  } catch (error) {
    throw error
  }
}

//creating hashing function with bcrypt
const securePassword=async(password)=>{
  try {
      const hashedPassword=await bcrypt.hash(password,10)
      return hashedPassword
      
  } catch (error) {
     
      throw error
  }
}


//email verification
const sendResetPasswordMail=async (name,email,verificationLink)=>{
  try {

      const transporter=nodemailer.createTransport({
          host:process.env.SMTP_HOST,
          port:587,
          secure:false,
          requireTLS:true,
          auth:{
              user:process.env.SMTP_USER,
              pass:process.env.SMTP_PASS
          }
      });
      const mailOptions={
          from:'adwaithjanardhanan5@gmail.com',
          to:email,
          subject:'Reset Your Password',
          
          html:`<div style="height: 300px;background-color: rgb(214,219,222); text-align: center; padding-top: 10%; margin: 25px;">
                  <h1>Welcome to <strong>Easy Cart</strong>..!</h1>
                  <h4 style="color:rgb(0,0,1);">Hello ${name} </h4>
                  <p>You recently requested to reset your password for your account at Easy Cart. Click the link below to reset it:</p>
                  <i>${verificationLink}</i>
              </div>`
      }
      transporter.sendMail(mailOptions,(er,info)=>{
          if(er){
              throw er
          }
          else{
              console.log("email has been send",info.response)
              return
          }
      })
      return true

  } catch (error) {
      throw error
      
  }
}



module.exports={
    generateRazorpay,
    changepaymentStatus,
    verifyOTP,
    addMoneyToWallet,
    debitFromWallet,
    releaseProducts,
    findProducts,
    checkRefundEligible,
    setCouponeApplied,
    setNewOrderTotal,
    generateInvoice,
    eligibleForReturn,
    getMostSoldCategories,
    haveStock,
    securePassword,
    sendResetPasswordMail
}