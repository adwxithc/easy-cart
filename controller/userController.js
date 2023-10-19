const User=require('../model/userModel')

const nodemailer=require('nodemailer')
const bcrypt=require('bcrypt')
const otpGenerator = require('otp-generator');


//creating hashing function with bcrypt
const securePassword=async(password)=>{
    try {
        const hashedPassword=await bcrypt.hash(password,10)
        return hashedPassword
        
    } catch (error) {
        console.log(error.message)
        
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
                console.log(er)
            }
            else{
                console.log("email has been send",info.response)
            }
        })

    } catch (error) {
        console.log(error.message)
        
    }
}


// Verify an OTP and check if it has expired
function verifyOTP(otp, maxAgeInSeconds =120) {
        const otpTimestamp = otp.split(':')[1];
        const currentTime = Date.now() / 1000; // Convert to seconds
        const otpTime = parseFloat(otpTimestamp);
    
        if (otpTime + maxAgeInSeconds < currentTime) {
            // OTP has expired
            return false;
        }
    
        return true;
    

}

const guest=(req,res)=>{
    try {
        res.render('home')
        
    } catch (error) {
        console,log(error.message)
        
    }
}


const loadLogin=(req,res)=>{
    try {
      
        res.render('login') 
    } catch (error) {
        console.log(error.message)
        
    }
  
}

const verifyLogin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password =req.body.password;
        const userData=await User.findOne({email:email})
        if(userData){
            const hashedPassword=userData.password
            const passwordCheck= await bcrypt.compare(password,hashedPassword)
            if(passwordCheck){
                if(userData.status==1){
                    req.session.userId=userData._id
                    res.render('home')

                }else{
                    res.render('login',{message:"This account is blocked by the admin"})
                }

            }else{
                res.render('login',{message:"Wrong username password combination"})
            }

        }else{
            res.render('login',{message:"Wrong username password combination"})
        }

        
    } catch (error) {
        console.log(error.message)
        
    }
}

const loadRegister=(req,res)=>{
    try {
        res.render('register')
        
    } catch (error) {
        console.log(error)
    }
}

const signUp=async(req,res)=>{
    try {
      
        const check=await User.findOne({email:req.body.email})

        if(check){
            res.render('register',{message:"This email is already exist please login"})

        }else{
            const fname=req.body.fname
            const lname=req.body.lname
            const email=req.body.email
 
            const password=req.body.password
            const rePassword=req.body.rePassword
            console.log(req.body)
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

                //sending email
                sendverifyMail(`fname`,email,numericOTP)

                res.redirect('/loadOtpForm')

            }
        }
        
    } catch (error) {
        console.log(error.message)
        
    }

}

const loadOtpForm =async(req,res)=>{
    try {
        res.render('getOtp',{email:req.session.email})
        
    } catch (error) {
        console.log(error)
        
    }
}
const reSendOtp=(req,res)=>{
    if(req.session.otpWithTimestamp){
    const isNotExpired=verifyOTP(req.session.otpWithTimestamp,30) 
    if(!isNotExpired){
        // Generate a 6-digit numeric OTP
        const numericOTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });

                    
        req.session.otpWithTimestamp = `${numericOTP}:${Date.now() / 1000}`;
    // console.log("bofore sending email",req.session.email) 
        sendverifyMail(`${req.session.fname} ${req.session.lname}`,req.session.email,numericOTP)
        // console.log("after sending mail")
        res.json({status:"success",message:'New otp has been send to the email'})
    }else{
        console.log("wait 30 seconds")
        res.json({status:'success',message:'Please wait 30 seconds before requesting a new OTP'})
    }
}else{
    res.send('404')
}


}

const otpVerification=async(req,res)=>{
    if(req.session.otpWithTimestamp){
        const isNotExpired =verifyOTP(req.session.otpWithTimestamp)
        if(isNotExpired){
            const otp = req.session.otpWithTimestamp.split(':')[0];
            if(otp==req.body.otp){
                console.log('otp verified')

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
                    console.log("data inserted to data base")
                    res.render('home')

                }else{
                    console.log("data insertion failed")
                }

            }else{
                console.log("otp not verified")
                res.render('getOtp',{message:"Invalid OTP"})
            }
            

        }else{
            console.log("otp expired")
            res.render('getOtp',{message:"OTP has expired please resend OTP"})

        }
    }else{
        res.send('404')

    }
}

module.exports={
    guest,
    loadLogin,
    verifyLogin,
    loadRegister,
    signUp,
    loadOtpForm,
    reSendOtp,
    otpVerification
}
