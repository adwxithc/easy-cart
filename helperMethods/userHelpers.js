const Razorpay = require('razorpay');
const Order=require('../model/orderModel')
const User=require('../model/userModel')
const Cart=require('../model/cartModel')
const Product=require('../model/productModel')

var instance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

const generateRazorpay=(orderId,amount)=>{

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
      console.log(error)
      
    }
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
        console.error('Error adding money to wallet:', error);
    }
}

async function debitFromWallet(userId,amount,transactionId,description){
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
    
}

async function releaseProducts(order,cart,userId){

  for(let item of order.items){
                  
      await Product.updateOne({_id:item.product},{$inc:{stock:-item.quantity}})
    
  }
  if(cart){
      await Cart.deleteOne({user:userId})//checking the order is made on cart items if so empty the cart
  }

}

async function findProducts(matchCriteria,skip,limit,sortCriteria){
  console.log(matchCriteria)
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
      console.error('Error finding product:', error.message);
      throw new Error(error)
    }
  }
  



module.exports={
    generateRazorpay,
    changepaymentStatus,
    addMoneyToWallet,
    debitFromWallet,
    releaseProducts,
    findProducts
}