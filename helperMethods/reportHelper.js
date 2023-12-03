const CustomError = require('../Utils/CustomError');
const Order=require('../model/orderModel')


  async function generateSalesReport(timePeriod) {
    try {
      const currentDate = new Date();
      let startDate;
  
      switch (timePeriod) {
        case 'week':
          startDate = new Date(currentDate.getTime() - 5 * 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          let year = currentDate.getFullYear();
          let month = currentDate.getMonth() - 5;
  
          if (month < 0) {
            year -= Math.ceil(Math.abs(month + 1) / 12);
            month = 12 + (month % 12);
          }
  
          startDate = new Date(year, month, 1);
          break;
        case 'year':
          startDate = new Date(currentDate.getFullYear() - 5, 0, 1);
          break;
        default:
          
          throw new CustomError('Invalid time period specified',400);
      }
  
      const result = await Order.aggregate([
        {
          $unwind: '$items'
        },
        {
          $match: {
            'items.orderStatus': 'Delivered',
            'items.itemUpdatedAt': {
              $gte: startDate,
              $lte: currentDate,
            }
          }
        },
        {
          $group: {
            _id: generateGroupById(timePeriod),
            totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          }
        },
        generateSortStage(timePeriod),
        generateProjectStage(timePeriod)
      ]);

      
      return result;
      
    } catch (err) {
      
      throw err
      // Handle the error appropriately
    }
  }
  
  function generateGroupById(timePeriod) {

    switch (timePeriod) {
      case 'week':
        return { $week: '$items.itemUpdatedAt' };
      case 'month':
        return {
          year: { $year: '$items.itemUpdatedAt' },
          month: { $month: '$items.itemUpdatedAt' }
        };
      case 'year':
        return { $year: '$items.itemUpdatedAt' };
      default:
        throw new CustomError('Invalid time period specified',400);
    }
  }
  
  function generateSortStage(timePeriod) {
    switch (timePeriod) {
      case 'week':
        return { $sort: { '_id': 1 } };
      case 'month':
      case 'year':
        return { $sort: { '_id.year': 1, '_id.month': 1 } };
      default:
        throw new CustomError('Invalid time period specified',400);
    }
  }
  
  function generateProjectStage(timePeriod) {
    switch (timePeriod) {
      case 'week':
        return { $project: { _id: 0, week: '$_id', totalSales: 1 } };
      case 'month':
        return { $project: { _id: 0, year: '$_id.year', month: '$_id.month', totalSales: 1 } };
      case 'year':
        return { $project: { _id: 1, totalSales: 1 } };
      default:
        throw new CustomError('Invalid time period specified',400);
    }
  }
 

  async function averageOrderValueAndCount(startDate,endDate){
    try {
      const sales=await Order.aggregate([

        {
            $unwind:'$items'
        },
        {
            $match:{
                'items.orderStatus':'Delivered',
                'items.itemUpdatedAt': {
                    $gte: startDate,
                    $lte: endDate,
                  },
            }
        },
        {
            $group:{
                _id:'$_id',
                totalAmount:{
                    $sum:{
                        $multiply:['$items.price','$items.quantity']
                    }
                }
            }
        },
        {
            $group:{
                _id:null,
                'totalOrderAmount':{$sum:'$totalAmount'},
                'totalOrders':{$sum:1}
            }
        },
        {
            $project:{
                'totalOrderAmount':1,
                'totalOrders':1,
                'averageOrderValue':{
                    $divide:['$totalOrderAmount','$totalOrders']
                }

            }
        }
    ])
   

    return sales[0]?sales[0]:{totalOrderAmount:0,totalOrders:0,averageOrderValue:0}

    } catch (error) {
      throw error
    }

  }


  async function findTopSellingCategories(timePeriod) {
    try {
      const currentDate = new Date();
      let startDate;
  
      switch (timePeriod) {
        case 'week':
          startDate = new Date(currentDate.getTime() - 5 * 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = calculateMonthStartDate(currentDate, 5);
          break;
        case 'year':
          startDate = new Date(currentDate.getFullYear() - 5, 0, 1);
          break;
        default:
          throw new Error('Invalid time period specified');
      }
  
      const result = await Order.aggregate([
        {
          $unwind: '$items',
        },
        {
          $match: {
            'items.orderStatus': 'Delivered',
            'items.paymentStatus':'received',
            'items.itemUpdatedAt': {
              $gte: startDate,
              $lte: currentDate,
            },
          },
        },
        {
          $lookup: {
            from: 'products', // Use the actual name of the products collection
            localField: 'items.product',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        {
          $unwind:'$productDetails'
        },
        {
          $unwind: '$productDetails.category', // Unwind the category array
        },
        {
          $group: {
            _id: '$productDetails.category',
            totalQuantitySold: { $sum: '$items.quantity' },
          },
        },
        {
          $lookup: {
            from: 'categories', // Use the actual name of the categories collection
            localField: '_id',
            foreignField: '_id',
            as: 'categoryDetails',
          },
        },
        {
          $unwind:'$categoryDetails'
        },
        {
          $project: {
            categoryName: '$categoryDetails.name',
            totalQuantitySold: 1,
          },
        },
        {
          $sort: { totalQuantitySold: -1 },
        },
        {
          $limit: 5,
        },
      ]);
  
      return result;
    } catch (error) {
      
      throw error;
    }
  }
  
  function calculateMonthStartDate(currentDate, monthsAgo) {
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() - monthsAgo;
  
    if (month < 0) {
      year -= Math.ceil(Math.abs(month + 1) / 12);
      month = 12 + (month % 12);
    }
  
    return new Date(year, month, 1);
  }
  
async function salesReport(timePeriod,paymentStatus,orderStatus){
  try {

    const currentDate = new Date();
    let startDate;

    switch (timePeriod) {
      case 'week':
         // Calculate the start and end dates for the current week

          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());

        break;
      case 'month':
        
         startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
         
        break;
      case 'year':
        startDate = new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0); // January 1st
        break;
        case 'all':
        startDate = new Date(2000,0,1)
        //no idea what to do
        break;
      default:
        throw new CustomError('Invalid time period specified',400);
    }

    const matchStage = {
      $match: {
        'items.itemUpdatedAt': {
          $gte: startDate,
          $lte: currentDate,
        },
      },
    };

    if (paymentStatus && paymentStatus !== 'all') {
      matchStage.$match['items.paymentStatus'] = paymentStatus;
    }
    if(orderStatus && orderStatus!== 'all'){
      matchStage.$match['items.orderStatus'] = orderStatus;
    }


  const sales=await Order.aggregate([
    {
      $unwind:'$items'
    },
    matchStage,
    {
      $lookup:{
        from:'users',
        localField:'customer',
        foreignField:'_id',
        as:'customer'
      }
    },
    {
      $unwind:'$customer'
    },
    {
      $lookup:{
        from:'products',
        localField:'items.product',
        foreignField:'_id',
        as:'product'
      }
    },
    {
      $unwind:'$product'
    },
    {
      $project:{
        'orderNumber':1,
        orderDate:'$createdAt',
        deliveryDate:'$updatedAt',
        customer:{ $concat: ['$customer.fname', ' ', '$customer.lname'] },
        customerId:'$customer._id',
        product:'$product.name',
        productId:'$product._id',
        paymentMethod:1,
        paymentStatus:'$items.paymentStatus',
        orderStatus:'$items.orderStatus',
        price:'$items.price',
        quantity:'$items.quantity',
        totalPrice:{$multiply:['$items.price','$items.quantity']}
        
      }
    }
  ])
    return sales
  } catch (error) {
    
    throw error
  }

}


  

module.exports={

    generateSalesReport,
    averageOrderValueAndCount,
    findTopSellingCategories,
    salesReport
}