const isLogin=(req,res,next)=>{
    try {
        if(req.session.userId){
            next()
        }else{

            res.redirect('/login?unautherised=true');
        }
        
    } catch (error) {
        next(error)
        
    }
}
const isLogout=(req,res,next)=>{
    try {

        if(req.session.userId){
            res.redirect('/userHome')
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