const express=require('express')
const cart_route=express()
const cartController=require('../controller/cartController')
const validateUserInput=require('../middleware/validateUserInput')
const session=require('express-session')

//configuring session
cart_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))


cart_route.set('views','./views/cart')
cart_route.set('view engine','ejs')


cart_route.post('/add-to-cart',validateUserInput.validateCartInputs,cartController.addToCart)


module.exports=cart_route