const User=require('../model/userModel')
const Product=require('../model/productModel')
const Category=require('../model/categoryModel')
const Brand=require('../model/brandModel')
const Cart=require('../model/cartModel')
const Address=require('../model/addressModel')
const offerHelper=require('../helperMethods/offer')
const userHelpers=require('../helperMethods/userHelpers')
const crypto=require('crypto')
const mongoose=require('mongoose')
const Banner=require('../model/bannerModel')
const asyncErrorHandler=require('../Utils/asyncErrorHandler')

const nodemailer=require('nodemailer')
const bcrypt=require('bcrypt')
const otpGenerator = require('otp-generator');
const CustomError = require('../Utils/CustomError')
const { timeStamp } = require('console')


//creating hashing function with bcrypt
const securePassword=async(password)=>{
    try {
        const hashedPassword=await bcrypt.hash(password,10)
        return hashedPassword
        
    } catch (error) {
       
        throw error
    }
}


//email verification
const sendverifyMail=async (name,email,otp)=>{
    try {

        const transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'adwaithjanardhanan5@gmail.com',
                pass:'lmxlwvzxbrutxbdd'
            }
        });
        const mailOptions={
            from:'adwaithjanardhanan5@gmail.com',
            to:email,
            subject:'for email OTP verification',
            // html:'<p>hi Mr.'+name+'your One Time Password is '+otp+'</p>'
            html:`<div style="height: 300px;background-color: rgb(214,219,222); text-align: center; padding-top: 10%; margin: 25px;">
                    <h1>Welcome to <strong>Easy Cart</strong>..!</h1>
                    <h4 style="color:rgb(0,0,1);">Hello ${name} Thank You for Joinig to Easy Cart please use the One Time Password to verify your account</h4>
                    <h2><strong style="color: blue;">${otp}</strong></h2>
                </div>`
        }
        transporter.sendMail(mailOptions,(er,info)=>{
            if(er){
                throw er
            }
            else{
                console.log("email has been send",info.response)
            }
        })

    } catch (error) {
        throw error
        
    }
}

//rendering the site for all
const guest= asyncErrorHandler (async(req,res,next)=>{
        const mostPopularProducts = await Product.aggregate([
        {
          $unwind: '$rating', // Unwind the rating array to have one document per rating
        },
        {
          $group: {
            _id: '$_id',
            averageRating: { $avg: '$rating.value' }, // Calculate the average rating for each product
            product: { $first: '$$ROOT' }, // Store the product details for later use
          },
        },
        {
          $sort: { averageRating: -1 }, // Sort by average rating in descending order
        },
        {
          $limit: 8, // Limit the result to 8 products
        },
        ]);
    
        //GETTING BANNER DATAS
        const banners=await Banner.aggregate([
            {
                $match:{
                    status:true,
                    deleted:false
                }
            }
        ]);

        //GETTING BRAND DATAS
        const brands=await Brand.find({status:true})

        //GETTING MOST SOLD CATEGORIES DATAS
        const mostSoldCategories=await userHelpers.getMostSoldCategories()

        //GETTING LATEST PRODUCT DATAS
        const latestProducts=await Product.find({status:true}).sort({ addedDate: -1 }).limit(8)

        //GETTING AFFORDABLE PRODUCTS DATAS
        const affordableProducts=await Product.find({status:true}).sort({ price: 1 }).limit(8)
        res.render('home',{latestProducts:latestProducts,affordableProducts:affordableProducts,user:false,banners:banners,mostSoldCategories:mostSoldCategories,brands:brands,mostPopularProducts:mostPopularProducts})

});

//view product details
const productDetails=asyncErrorHandler( async(req,res,next)=>{
   
        const {id}=req.query
        const cart=req.cart

        // const productsWithCategories = await Product.findOne({_id:id}).populate('category','name').populate('brand','name')
        const productDetails=await Product.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup:{
                    from:'categories',
                    localField:'category',
                    foreignField:'_id',
                    as:'categoryData'
                }
            },
            {
                $lookup:{
                    from:'brands',
                    localField:'brand',
                    foreignField:'_id',
                    as:'brandData'
                }
            },
            {
                $lookup:{
                    from:'users',
                    localField:'rating.userId',
                    foreignField:'_id',
                    as:'userInfo'
                }
            }

            
        ])
        

        const inCart=cart?.cartItems.find(item=>item.product.equals(id))


        if(productDetails && productDetails.length>0){

            res.render('productDetails',{productDetails:productDetails[0],inCart:inCart,user:req.session?.userId})

        }else{
            const err=new CustomError('Invalid request',400)
            next(err)

        }

})

const search= asyncErrorHandler( async(req,res, next)=>{
    
    const key=req.body.searchKey||''

    res.redirect(`/shop?key=${key}`)

})


const loadLogin=(req,res,next)=>{

    if(req.query.unautherised) res.status(401)
    res.render('login-register/login',{title:'login'});  
 
}

const verifyLogin= asyncErrorHandler (async(req,res, next)=>{

        const {email, password}=req.body;
 
        const userData=await User.findOne({email:email})
        if(userData){
            const hashedPassword=userData.password
            const passwordCheck= await bcrypt.compare(password,hashedPassword)
            if(passwordCheck){
                if(userData.status==1){
                    req.session.userId=userData._id

                
                res.redirect('/userHome');
                }else{
                    res.render('login-register/login',{message:"This account is blocked by the admin",title:'login'})
                }

            }else{
                res.render('login-register/login',{message:"Wrong username password combination",title:'login'})
            }

        }else{
            res.render('login-register/login',{message:"Wrong username password combination",title:'login'})
        }

})

const userHome=asyncErrorHandler( async(req,res, next)=>{


        const id=req.session?.userId
        const mostSoldCategories=await userHelpers.getMostSoldCategories()
        
        const brands=await Brand.find({status:true})
        

        const latestProducts=await Product.find({status:true}).sort({ addedDate: -1 }).limit(8)
        const affordableProducts=await Product.find({status:true}).sort({ price: 1 }).limit(8)

        const banners=await Banner.aggregate([
            {
                $match:{
                    status:true,
                    deleted:false
                }
            }
        ])
        
        const cart=await Cart.aggregate([
            {
                $match:{
                    user:new mongoose.Types.ObjectId(req.session.userId)
                }
            }
        ])

        res.render('home',{latestProducts:latestProducts,affordableProducts:affordableProducts,user:id,cart:cart[0],banners:banners,mostSoldCategories:mostSoldCategories,brands:brands})

})

const loadRegister=(req,res, next)=>{
    try {
        const {refer}=req.query || null
        res.render('login-register/register',{refer:refer,title:'sign up'})
        
    } catch (error) {
        next(error)
    }
}

const signUp= asyncErrorHandler( async(req,res, next)=>{

      
        const check=await User.findOne({email:req.body.email})

        if(check){
            res.render('login-register/register',{message:"This email is already exist please login",refer:req.body.refer,title:'sign up'})

        }else{

           const {fname,lname,email,password,rePassword,refer}=req.body

            if(!(fname&&lname&&email&&password&&rePassword)){
                res.render('register',{message:"Please fill all the fields"})
            }else if(password!=rePassword){
                res.render('register',{message:"You entered two diffrent password"})
            }else{

                // Generate a 6-digit numeric OTP
                const numericOTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });

                req.session.otpWithTimestamp = `${numericOTP}:${Date.now() / 1000}`;

                const spassword=await securePassword(req.body.password)

                //adding data to session
                req.session.fname=fname
                req.session.lname=lname
                req.session.email=email
                req.session.password=spassword
                req.session.refer=refer

                //sending email
                sendverifyMail(`${fname} ${lname}`,email,numericOTP)

                res.redirect('/loadOtpForm')

            }
        }

});

const loadOtpForm =(req,res, next)=>{
    try {
        const seconds=Number(req.session?.otpWithTimestamp?.split(':')[1])
        const expire=(seconds+120)
        
        res.render('login-register/otp',{title:'otp',expire:expire})
        
    } catch (error) {
        next(error)
        
    }
}

const reSendOtp=(req,res, next)=>{
    try {
       
        if(req.session.otpWithTimestamp){
            const isNotExpired= userHelpers.verifyOTP(req.session.otpWithTimestamp,30) 
            if(!isNotExpired){
                // Generate a 6-digit numeric OTP
                const numericOTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });
        
                            
                req.session.otpWithTimestamp = `${numericOTP}:${Date.now() / 1000}`;
            
                sendverifyMail(`${req.session.fname} ${req.session.lname}`,req.session.email,numericOTP)

                const seconds=Number(req.session?.otpWithTimestamp?.split(':')[1])
                const expire=(seconds+120)
                
                res.json({status:"success",message:'New otp has been send to your email',expire:expire})
            }else{
                
                res.json({status:'success',message:'Please wait 30 seconds before requesting a new OTP'})
            }
        }else{
            const err=new CustomError('Invalid request',400)
            return next(err)
        
        }
        
    } catch (error) {
        next(error)
    }

}

const otpVerification=asyncErrorHandler( async(req,res,next)=>{

        const refer=req.refer
        
    
            const user=new User({
                fname:req.session.fname,
                lname:req.session.lname,
                email:req.session.email,
                password:req.session.password,
              
            })
            req.session.fname=null
            req.session.lname=null
            req.session.email=null
            req.session.password=null
            req.session.otpWithTimestamp=null

        
            const userData=await user.save()
            if(userData){

                if(refer){
                    const transactionId1=crypto.randomBytes(8).toString('hex')
                    await userHelpers.addMoneyToWallet(refer._id,100,transactionId1,`A referral bonus is added to the  wallet as a token of appreciation for bringing in a new user ${userData.fname+' '+userData.lname}`)
                    
                    const transactionId2=crypto.randomBytes(8).toString('hex')
                    await userHelpers.addMoneyToWallet(userData._id,100,transactionId2,`A welcome bonus is added to the wallet as a special benefit for joining through a referral code of ${refer.fname+' '+refer.lname}`)
                }

                res.redirect('/userHome')

            }else{
             const err=new CustomError('Failed to register user',500)
             return next(err)
                
            }
    
});

const logout=(req,res,next)=>{

        req.session.destroy((er)=>{
        if(er) return next(er)
        
        else res.redirect('/')

        });
}

const loadForgotPassword=asyncErrorHandler( async(req, res)=>{

    res.render('login-register/forgotPassword',{title:'Reset Password'})
})

const forgotPassword=asyncErrorHandler( async(req,res, next)=>{
    const { email } = req.body;

    // Check if user exists with the given email
    const user = await User.findOne({ email });
  
    if (!user) {
        return res.status(400).render('login-register/forgotPassword',{title:'Forgot Password',message:'No existing user'})
    }

    // Generate token and timestamp
    const token = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now()/1000;
  
    // Combine token and timestamp
    const combinedString = `${token}|${timestamp}`;
   
    // Encrypt the combined string with SHA256
    const signature = crypto.createHash('sha256',process.env.RESET_PASSWORD_SECRET).update(combinedString).digest('hex');

    // Create verification link
    const verificationLink = `${process.env.BASE_URL}/reset-password?token=${token}&email=${email}`;
  
    // Send email with verification link
    const mailSended = await userHelpers.sendResetPasswordMail(user.fname,user.email,verificationLink);
    
    if(mailSended){
        await User.updateOne({_id:user._id},{$set:
            {
                'resetPassword.signature':signature,
                'resetPassword.timestamp':timestamp
            }
        })
        
        res.render('login-register/login.ejs',{title:'login',message:'A verification mail is sended to you email please verify to reset your password'})
    }else{
        const err = new CustomError('verification email sending failed',500)
        next(err)
    }

})

const loadResetPassword=asyncErrorHandler( async(req, res, next)=>{
    const {email, token}=req.query
    res.render('login-register/resetPassword.ejs',{title:'Reset Password',email:email,token:token})
})

const resetPassword=asyncErrorHandler( async(req, res, next)=>{

    const {password, rePassword, email, token} =req.body
    if(!password || !rePassword || password!==rePassword){
        const err =new CustomError('Invalid request: Passwords must be present and match',400)
        return next(err)
    }
    const sPassword=await securePassword(password)
    const passwordUpdated= await User.updateOne({email:email},{$set:{password:sPassword}})
    if(passwordUpdated.modifiedCount==1){
        res.render('login-register/login',{title:'login',message:'Your password has been successfully changed. Please proceed  login.'})
    }
    
})



const loadProfile=asyncErrorHandler( async(req,res, next)=>{

        const user=req.user
        res.render('profile',{user:user})
        
});

//update user info
const updateUserInfo=asyncErrorHandler( async(req,res, next)=>{

    const user=await User.updateOne({_id:req.session.userId},{$set:req.body})
    if(user){
        res.json({message:'profile update successfuly',updated:true})
    }
});

const loadManageAddress=asyncErrorHandler(async(req,res, next)=>{
    const Addresses=await Address.find({user:req.session.userId}).sort({updatedAt:-1})
    res.render('manageAddress',{Addresses:Addresses})
});

const addNewAddress=asyncErrorHandler( async(req,res, next)=>{
        const address=new Address(req.address)
        const added=await address.save()
        if(added){
            res.status(201).json({message:'New address added successfully',added:true,newAddress:added})
        }else{
            const err=new CustomError('Failed to added new address',400)
            next(err)
        }

});

const loadEditAddress=asyncErrorHandler( async(req,res, next)=>{

        const user=await User.findById(req.session.userId)
        const address=await Address.findById(req.query.id)
        if(address){
            res.render('editAddress',{address:address,user:user})
        }else{
            const err=new CustomError('Address not found ')
            next(err)
           
        }
});

const updateAddress=asyncErrorHandler( async(req,res, next)=>{

       
        const updated=await Address.updateOne({_id:req.body.addressId},{$set:req.address})
        if(updated){
            res.json({message:'Address updated successfuly',success:true})
        }else{
            const err=new CustomError('Address updation failed',400)
            next(err)
        }

});

const deleteAddress=asyncErrorHandler( async(req,res, next)=>{
   
        const removed=await Address.deleteOne({_id:req.body.id})
        if(removed.deletedCount > 0){
            res.json({message:'Address Deleted',deleted:true})
        }else{
            const err= new CustomError('unable to Delete Address',400)
            next(err)
        }
})

const changePassword=(req, res, next)=>{
    try {
        res.render('changepassword')
        
    } catch (error) {
        next(error)
    }
}

const updatePassword=asyncErrorHandler( async(req,res, next)=>{

        const password=req.body.cPassword
        const user=req.user

        const hashedPassword=user.password
        const valid=await bcrypt.compare(password,hashedPassword)
        if(!valid){
            res.json({message:'invalid password'})
        }else{
            const newHashedPassword =await securePassword(req.body.nPassword);
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.session.userId },
                { password: newHashedPassword },
                { new: true }
              );
            if(updatedUser){
                res.json({message:'password changed successfully',changed:true})
            }else{
                const err=new CustomError('password updation failed',500)
                next(err)
            }
        }
     
})

const loadContact=async(req,res, next)=>{
    try {
        res.render('contact')
    } catch (error) {
        next(error)
    }
}


const googleAuthSuccess=asyncErrorHandler( async(req,res)=>{
    req.session.userId=req.user._id
    res.redirect('/userHome')
})

const googleAuthFailure=asyncErrorHandler( async(req, res)=>{
        res.render('login-register/login',{title:'login',message:'your google authentication has failed'})
})

module.exports={
    guest,
    productDetails,
    search,

    loadLogin,
    verifyLogin,
    userHome,
    loadRegister,
    signUp,
    loadOtpForm,
    reSendOtp,
    otpVerification,
    logout,
    loadForgotPassword,
    forgotPassword,
    loadResetPassword,
    resetPassword,

    loadProfile,
    updateUserInfo,

    loadManageAddress,
    addNewAddress,
    loadEditAddress,
    updateAddress,
    deleteAddress,
    changePassword,
    updatePassword,

    loadContact,

    googleAuthSuccess,
    googleAuthFailure
}
