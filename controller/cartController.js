const Cart=require('../model/cartModel')

const addToCart=async(req,res)=>{
    try {
        if(req.session.userId){

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
                    res.json({message:"Product added to the cart",added:true})
    
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
                    res.json({message:"Product added to the cart",added:true})
                }else{
                    res.json({message:"Unable to  add the product to the cart"})
                }
            }
        }else{
            console.log('login')
            res.redirect('/login')
        }
        
        
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}



module.exports={
    addToCart
}