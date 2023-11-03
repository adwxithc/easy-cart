const User=require('../model/userModel')
const Address=require('../model/addressModel')
const Product=require('../model/productModel')
const Cart=require('../model/cartModel')
const Order=require('../model/orderModel')
const { default: mongoose } = require('mongoose')


const checkout=async(req,res)=>{
    try {
        //----------------------------validate quantity---------------------------------
        
        const user=await User.findById(req.session.userId)
        const addresses=await Address.find({user:req.session.userId})
     if(req.query.productId){

        const product=await Product.findById(req.query.productId).populate('brand')
        if(product.stock>=req.query.quantity){
            res.render('checkout',{user:user,addresses:addresses,product:product,quantity:req.query.quantity})
        }else{
            res.json({message:`Sorry, we can't provide the requested quantity of "${product.name}" as we have ${product.stock} units in stock.`})
        }
        
     }else{
        const cart = await Cart.findOne({ user:req.session.userId })
        .populate({
          path: 'cartItems.product',
          select: 'name images brand color',
          populate: {
            path: 'brand',
            select: 'name' 
          }
        });

        res.render('checkout',{user:user,addresses:addresses,cart:cart}) 
     }
        

       
    } catch (error) {
        console.log(error)
        res.status(500).render('errors/500.ejs')
    }
}



const confirmOrder=async(req,res)=>{
    try {
        
        const order=new Order(req.order)
        const orderData=await order.save()
        if(orderData){
            for(let item of req.order.items){
                
                await Product.updateOne({_id:item.product},{$inc:{stock:-item.quantity}})
               
            }

            if(req.cart){
                await Cart.deleteOne({user:req.session.userId})//checking the order is made on cart items if so empty the cart
            }

            res.json({message:'order confirmed',orderConfirmed:true,order:orderData._id})
        }else{
            res.json({message:'order confirmed',orderConfirmed:false})
        }
        
        
    } catch (error) {
        console.log(error)
        res.status(500).render('errors/500.ejs')
    }
}

const orderResponse=async(req,res)=>{
    try {
        if(req.query.order){
        const user=await User.findById(req.session.userId)

            const orderData = await Order.findById(req.query.order)
            .populate({
              path: 'items.product',
              select: 'color images name size',
              populate: {
                path: 'brand',
                select: 'name',
              },
            });


            res.render('orderResponse',{orderData:orderData,user:user})
        }

    } catch (error) {
        console.log(error)
        res.status(500).render('errors/500.ejs')
        
    }
    
}





module.exports={
    checkout,
    confirmOrder,
    orderResponse
}