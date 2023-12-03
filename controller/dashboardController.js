const asyncErrorHandler = require('../Utils/asyncErrorHandler')
const adminHelpers=require('../helperMethods/adminHelpers')
 
 const getStats=asyncErrorHandler(async (req,res, next)=>{

    const getTotalTransactions=await adminHelpers.getTotalTransactions()
    if(getTotalTransactions){
        console.log(getTotalTransactions)

        const transactions={
            totaltransactions:getTotalTransactions,
            labels:['WALLET','ONLINE-TRANSFER','COD']
        }
        res.json({transactions:transactions})
    }

})

const getBasicInfos=asyncErrorHandler( async(req,res, next)=>{

    const userCount=await adminHelpers.getTotalListedUsers()
    const totalOrdersThisMonth=await adminHelpers.calculateTotalOrdersThisMonth()
    res.json({
        userCount:userCount,
        totalOrdersThisMonth:totalOrdersThisMonth
    })

})

module.exports={
    getStats,
    getBasicInfos
}