const Brand=require('../model/brandModel')



const validateBrandData =async(req,res,next)=>{

    const name=req.body.name
    const description=req.body.description
    const logo=req.file?.filename||req.body.logo
    
    if(name&& description&& logo){
        const check=await Brand.findOne({name:{$regex:new RegExp(`^${name}$`,'i')}})
        if(check){
            console.log("This brand already exist")
            res.json({message:"This brand already exist"})


        }else{
            req.brandData={
                name:name,
                description:description,
                logo:logo
            }
            next()
        }


    }else{
        res.json({message:"Please fill all the fealds"})
    }


}

 const validateUpdatedBrandData=async(req,res,next)=>{

    try {


    const name=req.body.name;
    const description=req.body.description
    const logo=req.body.logo || req.file.filename
    const id=req.body.id

    if(name&&description){

        const brand=await Brand.findById(id)
        const brandChechByName=await Brand.findOne({name:name})
    

        if(brandChechByName && !brand._id.equals(brandChechByName._id)){
            res.json({message:"This name has already stored as a seperate brand"})
        }else{


            
        if(req.file?.filename){

            req.logo=brand.logo

                    req.brandData={
                        name:name,
                        description:description,
                        logo:logo
                    }
                    next()


                                
        
        }


        }

    }else{
        res.json({message:"Please provide all informations"})
    }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }
    
}



module.exports={
 validateBrandData,
 validateUpdatedBrandData
}