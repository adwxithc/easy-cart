const Admin=require('../model/adminModel')


const loadLogin=(req,res)=>{
    try {
        res.render('adminLogin')
    } catch (error) {
        console.log(error)

        
    }
}

// const verifyLogin=async(req,res)=>{
//     try {

        
//     } catch (error) {
//         console.log(error.message)
//     }
// }

module.exports={
    loadLogin,
    // verifyLogin
}