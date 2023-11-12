const userHelpers=require('../helperMethods/userHelpers')
const crypto=require('crypto')
const User=require('../model/userModel')
const { default: mongoose } = require('mongoose')
const Order = require('../model/orderModel')


const loadWallet=async(req,res)=>{
    try {
        const user=await User.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(req.session.userId)
                }
            },
            {
                $project:{
                    wallet:1
                }
            },
            {
                $limit: 1
            }
        ])
        
        res.render('wallet',{user:user[0]})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const createAddAmount=async(req,res)=>{
    try {
        const amount=req.body.amount
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
                res.json({order:false})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json('internal server error')
    }
}
const verifyAddToWallet=async(req,res)=>{
    try {
        
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
                    res.json({message:'Amount added successfully',added:true,transaction:transaction})
                }
            }else{
                res.json({message:'not a valid user'})
            }
        }else{
           res.json({message:'payment not verified'})
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}


module.exports={
    loadWallet,
    createAddAmount,
    verifyAddToWallet
}