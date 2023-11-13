const adminHelpers=require('../helperMethods/adminHelpers')
const getStats=async (req,res)=>{
    try {
        const getTotalTransactions=await adminHelpers.getTotalTransactions()
        if(getTotalTransactions){
            console.log(getTotalTransactions)

            const transactions={
                totaltransactions:getTotalTransactions,
                labels:['WALLET','ONLINE-TRANSFER','COD']
            }
            res.json({transactions:transactions})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}

const getBasicInfos=async(req,res)=>{
    try {

    const userCount=await adminHelpers.getTotalListedUsers()
    const totalOrdersThisMonth=await adminHelpers.calculateTotalOrdersThisMonth()
    res.json({
        userCount:userCount,
        totalOrdersThisMonth:totalOrdersThisMonth
    })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}

module.exports={
    getStats,
    getBasicInfos
}