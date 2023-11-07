const Order=require('../model/orderModel')
const User=require('../model/userModel')
const Product=require('../model/productModel')
const loadOrders=async(req,res)=>{
    try {
      console.log(req.query.page)
        const user=await User.findById(req.session.userId)

        const page=req.query.page||1// specifies which page
        const pagesize=req.query.pageSize||5//specifies how much data page contains

        const offset=(page-1)*pagesize//specifies how much data to be skipped
        const limit=pagesize//specifies how much data needed
        
        
        const orderData = await Order.find()
        .sort({updatedAt:-1}).skip(offset).limit(limit)
        .populate({
          path: 'items.product',
          select: 'color images name size',
          populate: {
            path: 'brand',
            select: 'name',
          },
        });
       

        const totalOrdes=(await Order.find({customer:req.session.userId})).length
        const totalpages=Math.ceil(totalOrdes/pagesize)
        
        
        res.render('orders',{orderData:orderData,user:user,currentPage:page,totalpages:totalpages})
        
    } catch (error) {
        console.log(error)
        res.render('errors/500.ejs')
        
    }
}

const loadOrderDetails=async(req,res)=>{
    try { 
        const user=await User.findById(req.session.userId)
        
        const orderData = await Order.findOne({_id:req.query.orderId,customer:req.session.userId,items:{$elemMatch:{product:req.query.productId}}})
        .populate({
            path: 'items.product',
            match: { _id: req.query.productId } // This matches the specific product by its _id
          })
          let selectedProduct
          for(let item of orderData.items){
            if(item.product){

                selectedProduct=item
            }
          }
          orderData.items=selectedProduct
          if(orderData){
            res.render('orderDetails',{orderData:orderData,user:user})
          }else{
            res.status(404).render('errors/404.ejs')
          }
      
    } catch (error) {
        console.log(error)
        res.status(500).render('errors/500.ejs')
    }
}


const cancelOrder=async(req,res)=>{
  try {
    console.log(req.body)
    const orderData=await  Order.findOne({customer:req.session.userId,_id:req.body.orderId})
    if(orderData){
      for(let item of orderData.items){
        if(item.product==req.body.productId){
          if(item.orderStatus!='Canceled'){

            item.orderStatus='Canceled';
            item.canceledByUser=true
            await Product.updateOne({_id:req.body.productId},{$inc:{stock:item.quantity}})
            const orderCanceled =await orderData.save()
            if(orderCanceled){
                res.json({message:'order canceled successfully',canceled:true})
            }else{
              res.json({message:"Order cancelation failed",canceled:false})
            }
            

          }else{
            res.json({message:"This product has already been canceled",canceled:false})
          }

        }
      }
    }else{
      res.json({message:"This order doesn't exist",canceled:false})
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'Internal server error'})
  }
}


module.exports={
    loadOrders,
    loadOrderDetails,
    cancelOrder
}