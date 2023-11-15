const express=require('express')
const user_route=express()
const userController=require('../controller/userController')
const shopController=require('../controller/shopController')
const auth=require('../middleware/userAuth')
const session=require('express-session')
const validateUserInputs=require('../middleware/validateUserInput')


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


user_route.get('/login',auth.isLogout,userController.loadLogin)
user_route.post('/login',userController.verifyLogin)
user_route.get('/userHome',auth.isLogin,userController.userHome)

user_route.get('/register',auth.isLogout,userController.loadRegister)
user_route.post('/register',userController.signUp)
user_route.get('/loadOtpForm',auth.isLogout,userController.loadOtpForm)
user_route.post('/verifyOtp',userController.otpVerification)
user_route.get('/reSendOtp',auth.isLogout,userController.reSendOtp)
user_route.get('/logout',auth.isLogin,userController.logout)

user_route.get('/profile',auth.isLogin,userController.loadProfile)
user_route.put('/updateUserInfo',auth.isLogin,validateUserInputs.validateEditedUserInfo,userController.updateUserInfo)

user_route.get('/manageAddress',auth.isLogin,userController.loadManageAddress)
user_route.post('/addNewAddress',auth.isLogin,validateUserInputs.validateAddress,userController.addNewAddress)
user_route.get('/editAddress',auth.isLogin,userController.loadEditAddress)
user_route.put('/updateAddress',auth.isLogin,validateUserInputs.validateAddress,userController.updateAddress)
user_route.delete('/deleteAddress',auth.isLogin,userController.deleteAddress)
user_route.get('/changePassword',auth.isLogin,userController.changePassword)
user_route.post('/updatePassword',auth.isLogin,validateUserInputs.validateChangePassword,userController.updatePassword)

// shop
user_route.get('/shop',shopController.loadShop)
user_route.post('/searchProduct',userController.searchProduct)
user_route.post('/searchProducts',validateUserInputs.validateProductSearchCriteria,shopController.searchProducts)

module.exports=user_route

 