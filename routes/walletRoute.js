const express=require('express')
const wallet_route=express()
const walletController=require('../controller/walletController')

const auth=require('../middleware/userAuth')
const session=require('express-session')

//configuring session
wallet_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))


wallet_route.set('views','./views/wallet')
wallet_route.set('view engine','ejs')

wallet_route.get('/getWallet',walletController.loadWallet)
wallet_route.post('/addAmountToWallet',auth.isLogin,walletController.createAddAmount)
wallet_route.post('/verifyAddToWallet',auth.isLogin,walletController.verifyAddToWallet)

module.exports=wallet_route