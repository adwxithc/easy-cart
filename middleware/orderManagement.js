const Order=require('../model/orderModel')


function generateOrderNumber(lastOrderNumber) {

    if (!lastOrderNumber) {
      return 'ORD0001'; // If there are no previous orders, start with 0001.
    }
    const lastNumber = parseInt(lastOrderNumber.slice(3)); // Extract the number part.
    const nextNumber = lastNumber + 1;
    const paddedNextNumber = nextNumber.toString().padStart(8, '0'); // Ensure it's 4 digits.
    return `ORD${paddedNextNumber}`;
  }



async function getLastOrderNumber() {
  try {
    // Find the most recent order by sorting in descending order of orderDate and limiting the result to 1.
    const lastOrder = await Order
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    if (lastOrder && lastOrder.orderNumber) {
     
      return lastOrder.orderNumber;
    } else {
      // If there are no orders in the database, return a default value or handle the case as needed.
      return 'ORD0000'; 
    }
  } catch (error) {
    throw error()
    // Handle the error as appropriate for your application.
  }
}





  module.exports={
    generateOrderNumber,
    getLastOrderNumber
  }