const Product =require('../model/productModel')

const removeFromStock=async(newCart)=>{
    try {
        const product=await Product.findById(newCart.cartItems[0].product)
        if(newCart.cartItems[0].quantity<= product.stock){

            product.reservedStock+=newCart.cartItems[0].quantity
            product.stock-=newCart.cartItems[0].quantity

            return await product.save()  //should check the case when not changed
        }else{
            
            const customError = new Error('Stock value cant be less than 0');
            customError.originalError = error;
            return Promise.reject(customError)

        }
        
    } catch (error) {
        console.log(error)
        const customError = new Error('Stock update failed');
        customError.originalError = error;
        return Promise.reject(customError)
    }
}


               
const addToStock=async(productId,quantity)=>{
    try {

        const product =await Product.findById(productId)
        if(quantity<=product.reservedStock){
            product.reservedStock-=quantity;
            product.stock+=quantity
            
            return await product.save()

        }else{

        const customError = new Error('Stock value cant be less than 0');
        customError.originalError = error;
        return Promise.reject(customError)
        }
    } catch (error) {

        console.log(error)
        const customError = new Error('Stock update failed');
        customError.originalError = error;
        return Promise.reject(customError)

    }
}


module.exports={
    removeFromStock,
    addToStock
}
