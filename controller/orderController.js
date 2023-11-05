const Order=require('../model/orderModel')
const User=require('../model/userModel')
const Product=require('../model/productModel')
const loadOrders=async(req,res)=>{
    try {
        const user=await User.findById(req.session.userId)
        
        const orderData = await Order.find()
        .sort({updatedAt:-1})
        .populate({
          path: 'items.product',
          select: 'color images name size',
          populate: {
            path: 'brand',
            select: 'name',
          },
        });
        res.render('orders',{orderData:orderData,user:user})
        
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
        res.render('errors/500.ejs')
    }
}

module.exports={
    loadOrders,
    loadOrderDetails
}