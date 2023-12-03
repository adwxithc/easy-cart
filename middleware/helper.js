const CustomError = require("../Utils/CustomError");
asyncErrorHandler=require('../Utils/asyncErrorHandler')
const findOrderTotal=asyncErrorHandler(async(req,res,next)=>{

    if(req.product){
        const product=req.product
        const effectedDiscount=product.effectedDiscount?product.effectedDiscount:0;
        const productPrice=product.price-((product.price*effectedDiscount)/100)
        const totalAmount=productPrice*req.body.productQty
        req.body.total=totalAmount
        next()
    }else if(req.cart){
        let totalAmount=0
        const cart=req.cart
        if(cart && cart?.cartItems?.length>0 ){
            
            for(let item of cart.cartItems){
                const effectedDiscount=item.product?.effectedDiscount?item.product?.effectedDiscount:0
                const productPrice=item.price-((item.price*effectedDiscount)/100)
                item.MRP=item.price
                item.price=productPrice
                item.effectedDiscount=effectedDiscount
                totalAmount+=item.quantity*productPrice
            }
            req.body.total=totalAmount
            next()
        }else{
            res.json({message:"The user has no active cart",orderConfirmed:false})
        }
    }else{
        const err=new CustomError('Invalid request',400)
        next(err)
    }

})

module.exports={
    findOrderTotal
}