const Cart=require('../model/cartModel')
const Product=require('../model/productModel')
const StockManagemant=require('../middleware/stockManagement')
const asyncErrorHandler=require('../Utils/asyncErrorHandler')
const CustomError = require('../Utils/CustomError')

const addToCart=asyncErrorHandler( async(req, res, next)=>{

    let outOfStock=false
    const newCart=req.newCart

    const existingCart=await Cart.findOne({user:newCart.user})
    if(existingCart){
        if(existingCart.cartItems.length<7){
            
            let productAlreadyExist=false

            for(let item of existingCart.cartItems){
                
                if(item.product.toString()==newCart.cartItems[0].product){
                    const product=await Product.findById(item.product)
                    if(item.quantity+newCart.cartItems[0].quantity<product.stock){

                        item.quantity+=newCart.cartItems[0].quantity
                        productAlreadyExist=true
                        
                    }else{
                        outOfStock=true;
                        productAlreadyExist=true;
                    }
                    break;

                }
            }
            if(!productAlreadyExist){
                existingCart.cartItems.push(newCart.cartItems[0])
            }

            const cartUpdated=await  existingCart.save()

            if(cartUpdated && !outOfStock){
            

            // stockUpdated=await StockManagemant.removeFromStock(newCart)

            const count=cartUpdated.cartItems.length

            res.json({message:"Product added to the cart",added:true,count:count})

            }else if(outOfStock){
            res.json({message:"The specified amount of stock is currently not available"})
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
            // stockUpdated=await StockManagemant.removeFromStock(newCart)

            const count=cartAdded.cartItems.length
            res.json({message:"Product added to the cart",added:true,count:count})
        }else{
            const err= new CustomError("Unable to  add the product to the cart",500)
            next(err)
        }
    }

})


const goToCart=asyncErrorHandler( async(req,res, next)=>{

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

    res.render('cart',{cart:cart,user:req.session?.userId})

});


//---to sent the count of cart items

const cartCount=asyncErrorHandler( async(req,res, next)=>{

    const cart =await Cart.findOne({user:req.session.userId})

    if(cart){
        const numberOfItems=cart.cartItems.length
        res.json({count:numberOfItems})
    }

});

//-------------remove item from cart--------------------
const removeFromCart=asyncErrorHandler( async(req,res, next)=>{

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
            // const productToRemove=cart.cartItems.find(item=>item.product==productId)
            
            // await StockManagemant.addToStock(productId, productToRemove.quantity)

            res.json({message:"Cart item successfully removed",removed:true,cartLength:(cart.cartItems.length-1)})

        }else{
           
            const err= new CustomError("Cart item removal failed",500)
            next(err)
        }

    }else{
        const err= new CustomError("user has no active cart",400)
        next(400)

    }

});

const updateCartItemCount=asyncErrorHandler( async(req,res,next)=>{
        const change=req.item
        let updatedCount

        const product=await Product.findById(change.productId)
        if(product){
           

                const cart=await Cart.findOne({user:req.session.userId})

               
                for(let item of cart.cartItems){

                    if(item.product.equals(change.productId)){
                        
                        //incrementing case
                        if(change.operation=='inc'){

                            //incrementing within the stock
                            if(product.stock>=(change.quantity+item.quantity)){

                                item.quantity+=change.quantity
                                updatedCount=item.quantity
                                item.price=product.price

                                // product.stock-=change.quantity
                                // product.reservedStock+=change.quantity

                            }else{
                                item.quantity=product.stock
                                updatedCount=item.quantity
                                item.price=product.price


                       
                                // item.quantity+=product.stock
                                // updatedCount=item.quantity
                                // item.price=product.price

                                // product.reservedStock+=product.stock
                                // product.stock=0
                            }

                        //decrementing case
                        }else{
                            

                            if(item.quantity-change.quantity>0){
                                item.quantity-=change.quantity
                                updatedCount=item.quantity 
                                item.price=product.price

                                // product.stock+=change.quantity
                                // product.reservedStock-=change.quantity

                            }else{
                                updatedCount=1
                            }
                            
                            }
                        
                    }
                }

                await cart.save()
                // await product.save()

                res.json({quantity:updatedCount})

        }else{
        const err= new CustomError("This product doesn't exist",400)
           next(err)
        }

});



module.exports={
    addToCart,
    goToCart,
    cartCount,
    removeFromCart,
    updateCartItemCount
}