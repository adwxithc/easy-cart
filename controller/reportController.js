const reportHelper=require('../helperMethods/reportHelper')
const loadSalesReport=async(req,res)=>{
    try {

        res.render('salesReport')

    } catch (error) {
        console.log(error)
    }
}
const getSalesReport=async(req,res)=>{
    try {
       
        const topCategories=await reportHelper.findTopSellingCategories(req.timePeriod)
        let categoryqty=[],categoryNames=[]
        
        for(let item of topCategories){
            categoryNames.push(item.categoryName)
            categoryqty.push(item.totalQuantitySold)
        }

        console.log(categoryNames,categoryqty)
        
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
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}

const getSalesData=async(req,res)=>{
    try {
        const {timePeriod,paymentStatus,orderStatus}=req.query
        if(!['week','month','year','all'].includes(timePeriod)){
            res.status(404).json({message:'invalid timePeriod'})
        }else if(!['refunded','received','pending','all'].includes(paymentStatus)){
            res.status(404).json({message:'invalid paymentStatus'})
        }else if(!['Pending', 'Processing', 'Shipped', 'Delivered','Canceled','all'].includes(orderStatus)){
            res.status(404).json({message:'invalid orderStatus'})
        }else{
            const sales=await reportHelper.salesReport(timePeriod,paymentStatus,orderStatus)
        res.json({sales:sales})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}



module.exports={
    loadSalesReport,
    getSalesReport,
    getSalesData
}