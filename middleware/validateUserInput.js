const validateCartInputs=(req,res,next)=>{
    const userId=req.session.userId;

    const productId=req.body.productId;
    const productQuantity=parseInt(req.body.quantity);
    const price=req.body.price

    if(!productId || isNaN(productQuantity) || isNaN(price) || parseInt(productQuantity)<1 || parseInt(price)<1 ){
        res.json({message:'Invalide Information'})
    }else{

        req.newCart={
            user:userId,
            cartItems:[
                {
                    product:productId,
                    quantity:productQuantity,
                    price:price
                }
            ]
        }
        next()

    }

}

module.exports={
    validateCartInputs
}