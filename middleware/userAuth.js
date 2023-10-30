const isLogin=(req,res,next)=>{
    try {
        if(req.session.userId){
            
            next()
        }else{
            res.redirect('/login')
        }
        
    } catch (error) {
        console.log(error.message)
        res.render('errors/500.ejs')
        
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
        console.log(error.message)
        res.render('errors/500.ejs')
        
    }
}

module.exports={
    isLogin,
    isLogout
}