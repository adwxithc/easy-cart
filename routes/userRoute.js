const express=require('express')
const user_route=express()
const userController=require('../controller/userController')
const shopController=require('../controller/shopController')
const auth=require('../middleware/userAuth')
const session=require('express-session')
const validateUserInputs=require('../middleware/validateUserInput')
const checkExist=require('../middleware/checkExist')
const passport=require('passport')

user_route.use(passport.initialize())
user_route.use(passport.session())


user_route.use(express.urlencoded({extended:true}))
user_route.use(express.json())

user_route.set('view engine','ejs')
user_route.set('views','./views/user')


//configuring session
// user_route.use(session({
//     secret:process.env.SESSION_SECRET,
//     resave:false,
//     saveUninitialized:true
// }))

user_route.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ], prompt: 'select_account' }
));

user_route.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/google-auth-success',
        failureRedirect: '/google-auth-failure'
}));

user_route.get('/',auth.isLogout,userController.guest)
user_route.get('/productDetails',checkExist.hasCart,userController.productDetails)


user_route.get('/login',auth.isLogout,userController.loadLogin)
user_route.post('/login',userController.verifyLogin)
user_route.get('/userHome',auth.isLogin,userController.userHome)

user_route.get('/register',auth.isLogout,userController.loadRegister)
user_route.post('/register',userController.signUp)
user_route.get('/loadOtpForm',auth.isLogout,userController.loadOtpForm)
user_route.post('/verifyOtp',validateUserInputs.otp,checkExist.refer,userController.otpVerification)
user_route.get('/reSendOtp',auth.isLogout,userController.reSendOtp)
user_route.get('/logout',auth.isLogin,userController.logout)

user_route.get('/forgotPassword',userController.loadForgotPassword)
user_route.post('/forgotPassword',userController.forgotPassword)
user_route.get('/reset-password',checkExist.validToken,userController.loadResetPassword)
user_route.post('/resetPassword',checkExist.validToken,userController.resetPassword)

user_route.get('/profile',auth.isLogin,checkExist.user,userController.loadProfile)
user_route.put('/updateUserInfo',auth.isLogin,validateUserInputs.validateEditedUserInfo,userController.updateUserInfo)

user_route.get('/manageAddress',auth.isLogin,userController.loadManageAddress)
user_route.post('/addNewAddress',auth.isLogin,validateUserInputs.validateAddress,userController.addNewAddress)
user_route.get('/editAddress',auth.isLogin,userController.loadEditAddress)
user_route.put('/updateAddress',auth.isLogin,validateUserInputs.validateAddress,userController.updateAddress)
user_route.delete('/deleteAddress',auth.isLogin,userController.deleteAddress)
user_route.get('/changePassword',auth.isLogin,userController.changePassword)
user_route.post('/updatePassword',auth.isLogin,validateUserInputs.validateChangePassword,checkExist.user,userController.updatePassword)

// shop
user_route.get('/shop',checkExist.hasCart,shopController.loadShop)
user_route.post('/search',userController.search)
user_route.post('/searchProducts',validateUserInputs.validateProductSearchCriteria,checkExist.hasCart,shopController.searchProducts) 

user_route.get('/google-auth-success',userController.googleAuthSuccess)
user_route.get('google-auth-failure',userController.googleAuthFailure)

//CONTACT

user_route.get('/contact',userController.loadContact)

module.exports=user_route
