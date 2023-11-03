const express=require('express')
const order_route=express()
const orderController=require('../controller/orderController')
const validateUserInput=require('../middleware/validateUserInput')
const auth=require('../middleware/userAuth')
const session=require('express-session')

//configuring session
order_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))


order_route.set('views','./views/order')
order_route.set('view engine','ejs')

order_route.get('/orders',auth.isLogin,orderController.loadOrders)
order_route.get('/orderDetails',auth.isLogin,orderController.loadOrderDetails)

module.exports=order_route