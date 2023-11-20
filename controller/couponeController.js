const Coupone = require("../model/couponeModel")
const adminHelpers=require('../helperMethods/adminHelpers')

const loadAddcoupone=(req,res)=>{
    try {
       
        res.render('addCoupone')
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

const addCoupone=async(req,res)=>{
        try {

         
            const coupone = new Coupone(req.coupone)
            const saveCoupone= await coupone.save()
         

            if(saveCoupone){

                res.json({message:'coupone created',created:true})
            }else{
                res.json({message:'coupone creation failed',created:false})
            }
        
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
}

const loadViewCoupones=async (req,res)=>{
    try {
        const coupones=await Coupone.find({})
        res.render('viewCoupones',{coupones:coupones})

    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
} 
const loadEditCoupone=async(req,res)=>{
    try {

            const coupone=await Coupone.findById(req.query.id)
            res.render('editCoupone',{coupone:coupone})
        

    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const updateCoupone=async(req,res)=>{
    try {
        const updatedCoupon = await Coupone.findOneAndUpdate(
            { _id: req.body.couponeId },
            { $set: req.coupone },
            { new: true } 
        );
        if(updatedCoupon){
            res.json({updated:true,message:'coupone Updated successfully'})
        }else{
            res.json({updated:false,message:'coupone Updation failed'})

        }
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}

const listUnlistCoupone=async(req,res)=>{
    try {

        if( req.coupone.status){
            req.coupone.status=false
        }else{
            req.coupone.status=true
        }
        const updatedCoupon = await  req.coupone.save()
        if(updatedCoupon){
            res.json({updated:true,message:'coupone status changed',status:updatedCoupon.status})
        }else{
            res.json({updates:false,message:'failed to change coupone status'})
        }
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
}

module.exports={
    loadAddcoupone,
    addCoupone,
    loadViewCoupones,
    loadEditCoupone,
    updateCoupone,
    listUnlistCoupone
}