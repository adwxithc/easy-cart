const express=require('express')
const user_route=express()
const userController=require('../controller/userController')
const auth=require('../middleware/userAuth')
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

user_route.get('/',auth.isLogout,userController.guest)
user_route.get('/productDetails',userController.productDetails)
user_route.post('/searchProduct',userController.searchProduct)

user_route.get('/login',userController.loadLogin)
user_route.post('/login',userController.verifyLogin)
user_route.get('/userHome',auth.isLogin,userController.userHome)

user_route.get('/register',userController.loadRegister)
user_route.post('/register',userController.signUp)
user_route.get('/loadOtpForm',userController.loadOtpForm)
user_route.post('/verifyOtp',userController.otpVerification)
user_route.get('/reSendOtp',userController.reSendOtp)
user_route.get('/logout',userController.logout)

user_route.get('/profile',auth.isLogin,userController.loadProfile)
user_route.put('/updateUserInfo',auth.isLogin,userController.updateUserInfo)



module.exports=user_route

 