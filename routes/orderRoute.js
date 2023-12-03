const express=require('express')
const order_route=express()
const orderController=require('../controller/orderController')
const validateUserInput=require('../middleware/validateUserInput')
const auth=require('../middleware/userAuth')
const session=require('express-session')
const checkExist=require('../middleware/checkExist')

//configuring session
order_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))


order_route.set('views','./views/order')
order_route.set('view engine','ejs')

order_route.get('/orders',auth.isLogin,checkExist.user,orderController.loadOrders)
order_route.get('/orderDetails',auth.isLogin,checkExist.user,orderController.loadOrderDetails)
order_route.patch('/cancelOrder',auth.isLogin,checkExist.order,orderController.cancelOrder)
// order_route.get('/singleCancelNotEligible',auth.isLogin,orderController.singleCancelNotEligible)
order_route.get('/orderItems',auth.isLogin,orderController.orderItems)
order_route.patch('/cancenlWholeOrder',auth.isLogin,checkExist.order,orderController.cancenlWholeOrder)
order_route.get('/downloadInvoice',auth.isLogin,checkExist.orderId,orderController.downloadInvoice)
order_route.patch('/returnOrder',auth.isLogin,checkExist.order,validateUserInput.returnOrder,orderController.returnOrder)

module.exports=order_route