const express=require('express')
const user_route=express()
const userController=require('../controller/userController')
const session=require('express-session')


user_route.use(express.urlencoded({extended:true}))
user_route.use(express.json())

user_route.set('view engine','ejs')
user_route.set('views','./views/user')


//configuring session
user_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))

user_route.get('/login',userController.loadLogin)
user_route.post('/login',userController.verifyLogin)

user_route.get('/register',userController.loadRegister)
user_route.post('/register',userController.signUp)
user_route.get('/loadOtpForm',userController.loadOtpForm)
user_route.post('/verifyOtp',userController.otpVerification)
user_route.get('/reSendOtp',userController.reSendOtp)


module.exports=user_route

 