const asyncErrorHandler = require("../Utils/asyncErrorHandler");


const isLogin=(req,res,next)=>{
    try {
        if(req.session.adminId){
            next()
        }else{

            res.redirect('/admin');
        }
        
    } catch (error) {
        next(error)
        
    }
}
const isLogout=(req,res,next)=>{
    try {

        if(req.session.adminId){
            res.redirect('/admin/adminDashboard')
        }else{
            next()
        }
    } catch (error) {
       next(error)
        
    }
}

module.exports={
    isLogin,
    isLogout
}