const userHelpers=require('../helperMethods/userHelpers')
const crypto=require('crypto')
const User=require('../model/userModel')
const { default: mongoose } = require('mongoose')
const Order = require('../model/orderModel')
const asyncErrorHandler=require('../Utils/asyncErrorHandler')
const CustomError = require('../Utils/CustomError')


const loadWallet=asyncErrorHandler( async(req, res, next)=>{

        const user=req.user
        res.render('wallet',{user:user})

})

const createAddAmount=asyncErrorHandler( async(req,res, next)=>{
        const {amount} = req.body
        
        if(amount>0 && !isNaN(amount)){
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
              
        const id=crypto.randomBytes(8).toString('hex')
        userHelpers.generateRazorpay(id,amount).then(order=>{
                    res.json({order:order,userInfo:userInfo})
            })
        }else{
                const err=new CustomError('Invalid amount',400)
                next(err)
        }

})
const verifyAddToWallet=asyncErrorHandler( async(req,res, next)=>{

        const details=req.body;
        let hmac=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        hmac.update(details.payment?.razorpay_order_id+'|'+details.payment?.razorpay_payment_id)
        hmac=hmac.digest('hex')
        if(hmac==details.payment?.razorpay_signature){

            const user=User.findById(req.session.userId)
            if(user){
                //converting into rupees
                const amount=(details.order.amount)/100
              const updateUser=await userHelpers.addMoneyToWallet(req.session.userId,amount,details.payment.razorpay_payment_id,'Wallet recharge')
                if(updateUser){
                    const transaction=updateUser.wallet.transactions[updateUser.wallet.transactions.length-1]
                    const balance=updateUser.wallet.balance
                    console.log(balance)
                    res.json({message:'Amount added successfully',added:true,transaction:transaction,balance:balance})
                }
            }else{
                const err=new CustomError('Not a valid user',401)
                next(err)
            }
        }else{
           const err = new CustomError('payment not verified',400)
           next(err)
        }

});


module.exports={
    loadWallet,
    createAddAmount,
    verifyAddToWallet
}