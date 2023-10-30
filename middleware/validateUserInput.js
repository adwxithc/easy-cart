const Product=require('../model/productModel')
const Cart=require('../model/cartModel')

const validateCartInputs=async (req,res,next)=>{
    const userId=req.session.userId;

    const productId=req.body.productId;
    const productQuantity=parseInt(req.body.quantity);
    const price=req.body.price

    //const expiryTime = 24 * 60 * 60 * 1000;  //24 hours in milliseconds
    // const expiryTime = 60 *1000;  //24 hours in milliseconds 

   // const cartExpirationTime = new Date(Date.now() + expiryTime); // Set the cart expiration time

    if(!productId || isNaN(productQuantity) || isNaN(price) || parseInt(productQuantity)<1 || parseInt(price)<1 ){
        res.json({message:'Invalide Information'})
    }else{

        const product=await Product.findById(productId)
        if(!product){
            res.json({message:'product not fount'})
        }else if(product.stock<productQuantity){
            res.json({message:'Sorry, the requested quantity exceeds our current stock.'})
        }else{
            req.newCart={
                user:userId,
                cartItems:[
                    {
                        product:productId,
                        quantity:productQuantity,
                        price:price,
                        
                    }
                ],
                
            }

            //it also have   ->cartExpiration:cartExpirationTime
            next()
        }



    }

}

const validateCartItemCount=async(req,res,next)=>{
try {

    const productId=req.body.productId
    const quantity=req.body.quantity
    const operation=req.body.operation
    const cart=await Cart.findOne({user:req.session.userId})

    if(cart){
       
        if(isNaN(quantity) || quantity<0){
            
            res.json({message:'Invalid quatity'})
        }else{

            req.item={
                productId:productId,
                quantity:quantity,
            
                operation:operation
            }
            next()
        }


    }else{
        res.json({message:'User has no active cart'})
    }
    
} catch (error) {
    console.log(error.message)
    res.status(500).json({message:'internal server error'})
   
}}

module.exports={
    validateCartInputs,
    validateCartItemCount
}