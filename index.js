const express=require('express')
const app=express()
require('dotenv/config')
const mongoose=require('mongoose')
const { connectToMongoDB } = require('./dbConnect');
const userRoute=require('./routes/userRoute')
const adminRoute=require('./routes/adminRoute')
const cartRoute=require('./routes/cartRoute')
const checkoutRoute=require('./routes/checkoutRoute')
const orderRoute=require('./routes/orderRoute')
const walletRoute=require('./routes/walletRoute')
const errorRoute=require('./routes/errorRoute')
const CustomError=require('./Utils/CustomError')
const globalErrorHandler=require('./controller/errorController') 


//cart reservation
const cron=require('node-cron')
const tasks=require('./tasks/tasks')
const session=require('express-session')


app.set('view engine','ejs')


const PORT=process.env.PORT || 4000


connectToMongoDB()


//configuring session
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{ secure: false }
}))



//seting static files
app.use('/static',express.static('public'))



//passing to appropriate route
app.use('/admin',adminRoute)
app.use('/',userRoute)
app.use('/error',errorRoute)
app.use('/api',cartRoute)
app.use('/api',checkoutRoute)
app.use('/api',orderRoute)
app.use('/api',walletRoute)


// cron.schedule('0 * * * *',()=>{
//   tasks.expireCarts()
  
// })


// shedule cron to execute task to handle expires offers every day
cron.schedule('0 0 * * *',()=>{
  tasks.expireOffers()
  
})

app.all('*',(req,res,next)=>{
  const err=new CustomError(`OOps, Can't find "${req.originalUrl}" on server..!`,404)
  next(err)
})

app.use(globalErrorHandler)

app.listen(PORT,()=>{
    console.log(`app runs at : http://localhost:${PORT}`)
})