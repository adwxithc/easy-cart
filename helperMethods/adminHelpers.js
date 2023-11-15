const Order = require('../model/orderModel');
const Product=require('../model/productModel');
const User=require('../model/userModel')

async function calculateTotalSalesToday() {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Set the time to midnight for the current day
  
      const result = await Order.aggregate([
        {
          $project: {
            items: {
              $filter: {
                input: '$items',
                as: 'item',
                cond: {
                  $and: [
                    { $eq: ['$$item.paymentStatus', 'received'] },
                    { $gte: ['$$item.itemUpdatedAt', today] },
                  ],
                },
              },
            },
          },
        },
        {
          $unwind: '$items',
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: { $multiply: ['$items.price', '$items.quantity'] }, // Multiply price with quantity and then sum
            },
          },
        },
      ]);
  
      const totalSalesToday = result.length > 0 ? result[0].totalSales : 0;
      // console.log('Total sales today:', totalSalesToday);
      return totalSalesToday;
    } catch (error) {
      console.error('Error:', error);
      return new Error(error);
    }
  }
  

const calculateTotalOrdersToday=async()=>{
  
  try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set the time to midnight for the current day

        // MongoDB aggregation pipeline
        const result = await Order.aggregate([
        {
            $match: {
                createdAt:{
                    $gte:today
                }
            },
        },
        {
            $unwind: '$items',
        },
        {
            $match: {
            'items.orderStatus': {
                $ne: 'Canceled',
            },
            },
        },
        {
            $group: {
            _id: null,
            totalOrderedItems: {
                $sum: 1,
            },
            },
        },
        ]);

        const totalOrderedItems = result.length > 0 ? result[0].totalOrderedItems : 0;
        // console.log(`Today's total ordered items: ${totalOrderedItems}`);
        return totalOrderedItems
    } catch (error) {
        console.error('Error aggregating orders:', error);
        return new Error(error)
    }
}

async function calculateTotalOrdersThisMonth(){
   try {

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set the time to midnight for the current day

        // Get the first day of the current month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        firstDayOfMonth.setUTCHours(0, 0, 0, 0);

        // MongoDB aggregation pipeline
        const result = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: firstDayOfMonth,
                $lt: today, // Use less than to include orders up to the current day
              },
            },
          },
          {
            $unwind: '$items',
          },
          {
            $match: {
              'items.orderStatus': {
                $ne: 'Canceled',
              },
            },
          },
          {
            $group: {
              _id: null,
              totalOrderedItems: {
                $sum: 1,
              },
            },
          },
        ]);

        const totalOrderedItems = result.length > 0 ? result[0].totalOrderedItems : 0;
        return totalOrderedItems
    
  } catch (error) {
    console.log('error at calculateTotalOrdersThisMonth',error)
    throw new Error(error)
  }
}


async function calculateAverageOrderValue() {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Set the time to midnight for the current day
  
      // MongoDB aggregation pipeline
      const result = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: today,
            },
          },
        },
        {
          $unwind: '$items',
        },
        {
          $match: {
            'items.orderStatus': {
              $ne: 'Canceled',
            },
          },
        },
        {
          $group: {
            _id: '$_id', // Group by order ID to calculate per order
            totalAmount: {
              $sum: {$multiply:['$items.price','$items.quantity']}, // Sum up the price of each item by multiplying with its quantity in the order
            },
          },
        },
        {
          $group: {
            _id: null,
            totalOrderAmount: {
              $sum: '$totalAmount', // Sum up the total order amounts
            },
            totalOrders: {
              $sum: 1, // Count the number of orders
            },
          },
        },
      ]);
  
      const totalOrderAmount = result.length > 0 ? result[0].totalOrderAmount : 0;
      const totalOrders = result.length > 0 ? result[0].totalOrders : 0;
  
      if (totalOrders > 0) {
        const averageOrderValue = (totalOrderAmount / totalOrders).toFixed(2);;
        // console.log('-----tot',totalOrderAmount)
        // console.log('total---',totalOrders)
        // console.log(`Average Order Value (AOV): $${averageOrderValue.toFixed(2)}`);
        return averageOrderValue;
      } else {
        console.log('No orders for today.');
        return 0;
      }
    } catch (error) {
      console.error('Error calculating AOV:', error);
      throw new Error(error);
    }
  }
  

  async function calculateTodaysTotalDelivery(){
    try {

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set the time to midnight for the current day

        const result = await Order.aggregate([
        {
            $unwind: '$items',
        },
        {
            $match: {
            'items.orderStatus': 'Delivered',
            'items.itemUpdatedAt': {
                $gte: today,
            },
            },
        },
        {
            $group: {
            _id: null,
            totalDeliveredItems: { $sum: 1 },
            },
        },
        {
            $project: {
            _id: 0,
            totalDeliveredItems: 1,
            },
        },
        ]);

        const totalDeliveredItems = result.length > 0 ? result[0].totalDeliveredItems : 0;
        // console.log(`Today's total delivered items: ${totalDeliveredItems}`);
        return totalDeliveredItems
        
    } catch (error) {
        console.error('Error calculating AOV:', error);
        throw new Error(error);
    }
       

  }



// Function to find total transactions by payment method
async function getTotalTransactions() {
  try {
    // Count the total number of orders for each payment method
    // const walletTransactions = await Order.countDocuments({ paymentMethod: 'WALLET' });
    // const onlineTransactions = await Order.countDocuments({ paymentMethod: 'ONLINE-PAYMENT' });
    // const codTransactions = await Order.countDocuments({ paymentMethod: 'COD' });

    const codTransactions = await Order.aggregate([
      { $match: { paymentMethod: 'COD' } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } }
    ]);

    const walletTransactions = await Order.aggregate([
      { $match: { paymentMethod: 'WALLET' } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } }
    ]);

    const onlineTransactions = await Order.aggregate([
      { $match: { paymentMethod: 'ONLINE-PAYMENT' } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } }
    ]);
    // console.log('Total Wallet Transactions:', walletTransactions);
    // console.log('Total Online Transactions:', onlineTransactions);
    // console.log('Total COD Transactions:', codTransactions);
    return [walletTransactions[0].totalAmount,onlineTransactions[0].totalAmount,codTransactions[0].totalAmount]

  } catch (error) {
    console.error('Error:', error.message);
    throw new Error(error)
  }
}


const findMostSoldProducts = async () => {
  try {
    const orders = await Order.aggregate([
      {
        $unwind: '$items',
      },
      {
        $match: {
          'items.orderStatus': { $ne: 'Canceled' },
        },
      },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
        },
      },
      {
        $lookup: {
          from: 'products',  // Assuming 'products' is the name of your 'Product' collection
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $project: {
          _id: '$productDetails',  // Replace '_id' with the actual field you want to use
          totalSold: 1,
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 5,
      },
    ]);
    



    return orders
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
};

async function addMoneyToWallet(orderId,amount,transactionId,description){

  try {
    
    const userId=await Order.findOne({_id:orderId},{customer:1})
    
    // Find the user by ID and update the wallet atomically
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId.customer },
        {
            $inc: { 'wallet.balance': amount }, // Increment the wallet balance
            $push: {
                'wallet.transactions': {
                    type: 'credit',
                    amount: amount,
                    transaction_id: transactionId,
                    timestamp: Date.now(),
                    description: description,
                },
            }, // Add a new transaction to the array
        },
        { new: true } // Return the updated document
    );

    if (!updatedUser) {
       
        return false;
    }

    return updatedUser
} catch (error) {
    console.error('Error adding money to wallet:', error);
}

}

async function getTotalListedUsers(){
  try {

      const totalUsers = await User.countDocuments({ status: true });
      return totalUsers>0?totalUsers:0

    } catch (error) {
      console.log('Error at getTotalListedUsers',error)
      throw new Error(error)
    }
  
}





 
  

module.exports = {
    calculateTotalSalesToday,
    calculateTotalOrdersToday,
    calculateTotalOrdersThisMonth,
    calculateAverageOrderValue,
    calculateTodaysTotalDelivery,
    getTotalTransactions,
    findMostSoldProducts,
    addMoneyToWallet,
    getTotalListedUsers
};
