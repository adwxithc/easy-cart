const Cart=require('../model/cartModel')
const Product=require('../model/productModel')
const StockManagemant=require('../middleware/stockManagement')
const offerHelper=require('../helperMethods/offer')

// Periodically check and expire carts
const expireCarts = async () => {
    const now = new Date();

    // Find and update carts that have exceeded the cartExpiration time

    const expiredCarts = await Cart.find({cartExpiration: { $lt: now } });

    for (const cart of expiredCarts) {

        for (const cartItem of cart.cartItems) {
            
            StockManagemant.addToStock(cartItem.product,cartItem.quantity)
        }

        await Cart.findByIdAndRemove(cart._id);
    }
};

const expireOffers=async()=>{

    const products=await Product.aggregate([
        {
            $match:{
                status:true
            }
        }
    ])
    for(let product of products){
        const currentDate=new Date()
        if(!(product.effectedOfferStartDate<=currentDate && product.effectedOfferEndDate>currentDate)){

            const offer=await offerHelper.findProductLargestOffer(product._id)

            if(offer){
                // const currentDate=new Date()
                let effectedDiscount,effectedOfferStartDate,effectedOfferEndDate,productOffer=0,largestOffer=0;
            
                if(product.productOffer){
                        
                    if(product.productOffer?.startDate<=currentDate && product.productOffer?.expireDate>currentDate){
                    
                        productOffer=product.productOffer?.discountPercentage?product.productOffer.discountPercentage:0
                    }
                }
                

                if(offer.largestOffer?.discountPercentage){
                    largestOffer=offer.largestOffer?.discountPercentage
                }

            
                if(largestOffer>=productOffer){
                
                        effectedDiscount=largestOffer;
                        effectedOfferStartDate=offer.largestOffer.startDate
                        effectedOfferEndDate=offer.largestOffer.expireDate
                }else{
                    effectedDiscount=productOffer;
                    effectedOfferStartDate=product.productOffer.startDate
                    effectedOfferEndDate=product.productOffer.expireDate
                }
            
                await Product.updateOne({_id:product._id},{$set:{effectedDiscount:effectedDiscount,effectedOfferStartDate:effectedOfferStartDate,effectedOfferEndDate,effectedOfferEndDate}})

            }
        }

    }
}

module.exports={
    expireCarts,
    expireOffers
}
