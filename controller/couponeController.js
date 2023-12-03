const Coupone = require("../model/couponeModel")
const adminHelpers=require('../helperMethods/adminHelpers')
const asyncErrorHandler=require('../Utils/asyncErrorHandler')
const CustomError = require("../Utils/CustomError")

const loadAddcoupone=(req,res)=>{

    res.render('addCoupone')
}

const addCoupone=asyncErrorHandler( async(req,res, next)=>{

    const coupone = new Coupone(req.coupone)
    const saveCoupone= await coupone.save()
    

    if(saveCoupone){

        res.json({message:'coupone created',created:true})
    }else{
        const err=new CustomError('coupone creation failed',500)
        next(err)
    }

})

const loadViewCoupones=asyncErrorHandler( async (req,res, next)=>{

        const coupones=await Coupone.find({}).sort({updatedAt:-1})
        res.render('viewCoupones',{coupones:coupones})
  
})
const loadEditCoupone=asyncErrorHandler( async(req,res, next)=>{

    const coupone=await Coupone.findById(req.query.id)
    res.render('editCoupone',{coupone:coupone})

})

const updateCoupone=asyncErrorHandler( async(req,res, next)=>{

        const updatedCoupon = await Coupone.findOneAndUpdate(
            { _id: req.body.couponeId },
            { $set: req.coupone },
            { new: true } 
        );
        if(updatedCoupon){
            res.json({updated:true,message:'coupone Updated successfully'})
        }else{
            const err=new CustomError('coupone Updation failed',500)
            next(err)

        }
})

const listUnlistCoupone=asyncErrorHandler(async(req, res, next)=>{

        if(req.coupone){
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
        }else{
            const err=new CustomError("coupone doesn't exist",400)
            next(err)
        }

})

module.exports={
    loadAddcoupone,
    addCoupone,
    loadViewCoupones,
    loadEditCoupone,
    updateCoupone,
    listUnlistCoupone
}