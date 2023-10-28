const Cart=require('../model/cartModel')
const StockManagemant=require('../middleware/stockManagement')

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

module.exports={
    expireCarts
}
