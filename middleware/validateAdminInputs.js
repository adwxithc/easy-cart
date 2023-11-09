const Brand=require('../model/brandModel')
const Product=require('../model/productModel')


const validateProductDatas=async(req,res,next)=>{
    try {

        const images=[]
        for(let image of req.files){
            images.push(image.filename)
        }

        const productData=req.body
        const product=await Product.findById(req.body.id)
        if(!product){
            res.json({message:"This product doesn't exist",updated:false})

        }else if(!(productData.name&&productData.description&&productData.category.length&&productData.brand&&productData.stock&&productData.price&&productData.size&&productData.color)){
            res.json({message:'please provide all general informations',updated:false})
        }else if(isNaN(productData.stock) || Number(productData.stock)<0){
                res.json({message:'Invalid stock information',updated:false})
        }else if(isNaN(productData.price) || Number(productData.price)<0){
            res.json({message:'Invalid price information',updated:false})
        }else if(!images.length){
            res.json({message:'Please provide atlease one image',updated:false})
        }else{
            req.productData={
                name:productData.name,
                size:productData.size,
                description:productData.description,
                category:productData.category,
                stock:productData.stock,
                color:productData.color,
                price:productData.price,
                lastModified:Date.now(),
                brand:productData.brand,
                careInstructions:productData?.careInstructions,
                material:productData?.material,
                additionalSpecifications:productData?.additionalSpecifications,
                images:images
            }
            next()
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}

const validateBrandData =async(req,res,next)=>{
    

    const name=req.body.name
    const description=req.body.description
    const logo=req.file?.filename
    console.log(logo)
    
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
    const logo=req.file?.filename
    const id=req.body.id

    if(name&&description){

        const brand=await Brand.findById(id)
        const originalbrandData = { ...brand._doc };

        const brandChechByName=await Brand.findOne({name:name})
    

        if(brandChechByName && !brand._id.equals(brandChechByName._id)){
            res.json({message:"This name has already stored as a seperate brand"})
        }else{


            
        if(req.file?.filename){

            req.originalbrandData=originalbrandData
           

                    req.brandData={
                        name:name,
                        description:description,
                        logo:logo
                    }
                    next()


                                
        
        }else{
            
            req.brandData={
                name:name,
                description:description,
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
validateProductDatas,
 validateBrandData,
 validateUpdatedBrandData
}