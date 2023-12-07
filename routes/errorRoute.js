const express=require('express')
const error_route=express()
const session=require('express-session')


error_route.use(express.urlencoded({extended:true}))
error_route.use(express.json())

error_route.set('view engine','ejs')


//configuring session
// error_route.use(session({
//     secret:process.env.SESSION_SECRET,
//     resave:false,
//     saveUninitialized:true
// }))

error_route.get('/',(req,res)=>{
    const {homeLink, statusCode, message, status } = req.query;


    res.status(Number(statusCode)).render('error/error',{
        statusCode:statusCode,
        message:message,
        status:status,
        homeLink:homeLink

    })

})

module.exports=error_route
