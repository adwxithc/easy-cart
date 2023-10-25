const Cart=require('../model/cartModel')

const addToCart=async(req,res)=>{
    try {
        if(req.session.userId){
            console.log(req.body)
        }else{
            console.log('login')
            res.redirect('/login')
        }
        
        
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}



module.exports={
    addToCart
}