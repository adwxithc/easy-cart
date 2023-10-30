const express=require('express')
const app=express()
require('dotenv/config')
const mongoose=require('mongoose')
const userRoute=require('./routes/userRoute')
const adminRoute=require('./routes/adminRoute')
const cartRoute=require('./routes/cartRoute')

//cart reservation
const cron=require('node-cron')
const tasks=require('./tasks/tasks')




const PORT=process.env.PORT

//connecting to mongodb
mongoose.connect(process.env.MONGODB_URL_LOCAL)
const db = mongoose.connection;
db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });

  
//seting static files
app.use('/static',express.static('public'))

//passing to appropriate route
app.use('/admin',adminRoute)
app.use('/',userRoute)
app.use('/api',cartRoute)


// cron.schedule('0 * * * *',()=>{
//   tasks.expireCarts()
  
// })


app.listen(PORT,()=>{
    console.log(`app runs at : http://localhost:${PORT}`)
})