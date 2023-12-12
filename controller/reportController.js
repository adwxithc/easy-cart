const reportHelper=require('../helperMethods/reportHelper')
const asyncErrorHandler=require('../Utils/asyncErrorHandler')
const CustomError = require('../Utils/CustomError')
const loadSalesReport=async(req,res,next)=>{
    try {
        

        res.render('salesReport')

    } catch (error) {
        next(error)
    }
}
const getSalesReport=asyncErrorHandler( async(req,res,next)=>{

    const topCategories=await reportHelper.findTopSellingCategories(req.timePeriod)
    let categoryqty=[],categoryNames=[]
    
    for(let item of topCategories){
        categoryNames.push(item.categoryName)
        categoryqty.push(item.totalQuantitySold)
    }

    
    // Function call for the current month
    const current=await reportHelper.averageOrderValueAndCount(req.current.startDate, req.current.endDate);

    // Function call for the last month
    const last=await reportHelper.averageOrderValueAndCount(req.previous.startDate, req.previous.endDate);

    const salesReport=await reportHelper.generateSalesReport(req.timePeriod)
    let data=[]
    for(let item of salesReport){
        data.push(item.totalSales)
    }
    while (data.length < 5) {
        data.unshift(0);
        }
        
        res.json({statistics:data,currentSales:current,lastSales:last,categories:categoryNames,categoryqty:categoryqty})

});

const getSalesData=asyncErrorHandler( async(req,res, next)=>{
 
    const {timePeriod,paymentStatus,orderStatus}=req.query
    if(!['week','month','year','all'].includes(timePeriod)){
        const err = new CustomError('invalid timePeriod',400)
        next(err)

    }else if(!['refunded','received','pending','all'].includes(paymentStatus)){
        const err = new CustomError('invalid paymentStatus',400)
        next(err)
    }else if(!['Pending', 'Processing', 'Shipped', 'Delivered','Canceled','all'].includes(orderStatus)){
        const err = new CustomError('invalid orderStatus',400)
        next(err)
    }else{
        const sales=await reportHelper.salesReport(timePeriod,paymentStatus,orderStatus)
    res.json({sales:sales})
    }

})



module.exports={
    loadSalesReport,
    getSalesReport,
    getSalesData
}