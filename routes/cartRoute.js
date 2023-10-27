const express=require('express')
const cart_route=express()
const cartController=require('../controller/cartController')
const validateUserInput=require('../middleware/validateUserInput')
const auth=require('../middleware/userAuth')
const session=require('express-session')

//configuring session
cart_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))


cart_route.set('views','./views/cart')
cart_route.set('view engine','ejs')


cart_route.post('/add-to-cart',auth.isLogin,validateUserInput.validateCartInputs,cartController.addToCart)
cart_route.get('/goToCart',auth.isLogin,cartController.goToCart)
cart_route.get('/cartCount',auth.isLogin,cartController.cartCount)
cart_route.delete('/removeFromCart',auth.isLogin,cartController.removeFromCart)


module.exports=cart_route