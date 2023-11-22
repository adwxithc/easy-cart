const express=require('express')
const checkout_route=express()
const checkoutController=require('../controller/checkoutController')
const validateUserInput=require('../middleware/validateUserInput')
const chechExist=require('../middleware/checkExist')
const auth=require('../middleware/userAuth')
const session=require('express-session')

//configuring session
checkout_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))


checkout_route.set('views','./views/checkout')
checkout_route.set('view engine','ejs')

checkout_route.get('/checkout',auth.isLogin,checkoutController.checkout)
checkout_route.post('/confirmOrder',auth.isLogin,validateUserInput.validateCheckoutData,checkoutController.confirmOrder)
checkout_route.get('/orderResponse',auth.isLogin,checkoutController.orderResponse)
checkout_route.post('/verifyPayment',auth.isLogin,checkoutController.verifyPayment)
// checkout_route.post('/applyCoupone',auth.isLogin,checkoutController.getCoupone)
checkout_route.post('/getCoupone',auth.isLogin,chechExist.coupone,validateUserInput.coupone,checkoutController.getCoupone)


module.exports=checkout_route