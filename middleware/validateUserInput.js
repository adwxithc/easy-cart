const Product=require('../model/productModel')
const Cart=require('../model/cartModel')
const User=require('../model/userModel')

const validateCartInputs=async (req,res,next)=>{
    const userId=req.session.userId;

    const productId=req.body.productId;
    const productQuantity=parseInt(req.body.quantity);
    const price=req.body.price

    //const expiryTime = 24 * 60 * 60 * 1000;  //24 hours in milliseconds
    // const expiryTime = 60 *1000;  //24 hours in milliseconds 

   // const cartExpirationTime = new Date(Date.now() + expiryTime); // Set the cart expiration time

    if(!productId || isNaN(productQuantity) || isNaN(price) || parseInt(productQuantity)<1 || parseInt(price)<1 ){
        res.json({message:'Invalide Information'})
    }else{

        const product=await Product.findById(productId)
        if(!product){
            res.json({message:'product not fount'})
        }else if(product.stock<productQuantity){
            res.json({message:'Sorry, the requested quantity exceeds our current stock.'})
        }else{
            req.newCart={
                user:userId,
                cartItems:[
                    {
                        product:productId,
                        quantity:productQuantity,
                        price:price,
                        
                    }
                ],
                
            }

            //it also have   ->cartExpiration:cartExpirationTime
            next()
        }



    }

}

const validateCartItemCount=async(req,res,next)=>{
try {

    const productId=req.body.productId
    const quantity=req.body.quantity
    const operation=req.body.operation
    const cart=await Cart.findOne({user:req.session.userId})

    if(cart){
       
        if(isNaN(quantity) || quantity<0){
            
            res.json({message:'Invalid quatity'})
        }else{

            req.item={
                productId:productId,
                quantity:quantity,
            
                operation:operation
            }
            next()
        }


    }else{
        res.json({message:'User has no active cart'})
    }
    
} catch (error) {
    console.log(error.message)
    res.status(500).json({message:'internal server error'})
   
}}

const validateEditedUserInfo=async(req,res,next)=>{
    try {
        
        const emailRegx=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const mobileRegx=/^\d{10}$/;

        if(req.body.fname==''||req.body.lname==''||req.body.email==''){
            console.log(1)
            res.json({message:'Please fill all necessary informations',updated:false})
        }else if(!emailRegx.test(req.body.email.trim())){
            console.log(2)
            res.json({message:'Invalid email format',updated:false})
        }else if(!mobileRegx.test(req.body.mobile.trim()) && req.body.mobile!='' ){
            console.log(3)
            res.json({message:'Invalid phone number format',updated:false})
        }else{
            const user=User.findOne({_id:{$ne:req.session.userId},email:req.body.email})
            if(user){
                res.json({message:'This email is already in use',updated:false})
            }else{
                next()
            }
           
            
        }
        
    } catch (error) {
        console.log('error')
        res.status(500)
    }
}

const validateAddress=(req,res,next)=>{
    
    const pinRegx=/^\d{6}$/;
    const phoneRegx=/^[6789]\d{9}$/;
    const nameRegx=/^[A-Za-z\s'-]+$/;
    
    if(!(req.body.fname&& req.body.mobile&&req.body.pincode&&req.body.locality&&req.body.area&&req.body.cdt&&req.body.state)){

        res.json({message:'please fill all required fealds',added:false})

    }else if(!pinRegx.test(req.body.pincode.trim())){

        res.json({message:'Invalid pincode',added:false})

    }else if(!phoneRegx.test(req.body.altPhone.trim()) && req.body.altPhone.trim()!=''){

        res.json({message:'Invalid alternative phone number',added:false})
        
    }else if(!nameRegx.test(req.body.fname.trim())){

        res.json({message:'Invalid  first name',added:false})

    }else if(!phoneRegx.test(req.body.mobile.trim())){

        res.json({message:'Invalid  mobile number',added:false})

    }else{
        req.address={
            user:req.session.userId,
            name:req.body.fname,
            mobile:req.body.mobile,
            pincode:req.body.pincode,
            locality:req.body.locality,
            area:req.body.area,
            city:req.body.cdt,
            state:req.body.state,
            alternatePhone:req.body.altPhone,
            landmark:req.body.landmark
        }
        next()
    }

}


module.exports={
    validateCartInputs,
    validateCartItemCount,
    validateEditedUserInfo,
    validateAddress,
    
}