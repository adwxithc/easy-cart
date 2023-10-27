const Cart=require('../model/cartModel')

const addToCart=async(req,res)=>{
    try {
        

            const newCart=req.newCart

            const existingCart=await Cart.findOne({user:newCart.user})
            if(existingCart){
                if(existingCart.cartItems.length<7){

                    let productAlreadyExist=false

                    for(let item of existingCart.cartItems){
                        
                        if(item.product.toString()==newCart.cartItems[0].product){
                            item.quantity+=newCart.cartItems[0].quantity
                            productAlreadyExist=true
                            break;
                        }
                    }
                    if(!productAlreadyExist){
                        existingCart.cartItems.push(newCart.cartItems[0])
                    }
    
                   const cartUpdated=await  existingCart.save()

                   if(cartUpdated){
                    const count=cartUpdated.cartItems.length
                    res.json({message:"Product added to the cart",added:true,count:count})
    
                   }else{
                    res.json({message:"Unable to  add the product to the cart"})
                   }

                }else{
                    res.json({message:'The cart is full please checkout'})
                }


            }else{

                const cart =new Cart(newCart);
                const cartAdded=await cart.save()
                if(cartAdded){
                    const count=cartAdded.cartItems.length
                    res.json({message:"Product added to the cart",added:true,count:count})
                }else{
                    res.json({message:"Unable to  add the product to the cart"})
                }
            }
   
        
        
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const goToCart=async(req,res)=>{
    try {
        const userId=req.session.userId
        const cart = await Cart.findOne({ user: userId })
        .populate({
          path: 'cartItems.product',
          select: 'name images brand price',
          populate: {
            path: 'brand',
            select: 'name' // Optionally, you can specify which fields to select from the brand model
          }
        });

        console.log('-------------------------------------------------------------------------------------',cart)

        res.render('cart',{cart:cart,user:req.session?.userId})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).render('errors/500.ejs')
        
    }
}


//---to sent the count of cart items

const cartCount=async(req,res)=>{
    try {
     
        const cart =await Cart.findOne({user:req.session.userId})

        if(cart){
            const numberOfItems=cart.cartItems.length
            res.json({count:numberOfItems})
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error:"Internam server error"})
    }
}

//-------------remove item from cart
const removeFromCart=async(req,res)=>{
    try {
        const productId=req.query.productId
        const user=req.session.userId
        const cart=await Cart.findOne({user:user})

        if(cart){
            const removed=await Cart.updateOne({user:user},{
                $pull:{
                    cartItems:{
                        product:productId
                    }
                }
            })
           
            if(removed){
                res.json({message:"Cart item successfully removed",removed:true})

            }else{
                res.json({message:"Cart item removal failed"})
            }

        }else{
            res.json({message:"user has no active cart"})

        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error:"Internam server error"})
    }
}



module.exports={
    addToCart,
    goToCart,
    cartCount,
    removeFromCart
}