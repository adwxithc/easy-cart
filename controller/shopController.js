const Product=require('../model/productModel')
const Category=require('../model/categoryModel')
const Brands=require('../model/brandModel')
const userHelpers=require('../helperMethods/userHelpers')

const loadShop=async(req,res)=>{

    try {
        const products=await Product.find().limit(10);

        const totalProducts = await Product.countDocuments();
        const totalPages=Math.ceil(totalProducts/10)

        const categories=await Category.find({status:true},{name:1})
        const brands=await Brands.find({status:true},{name:1})
      
        res.render('shop',{products:products,categories:categories,brands:brands,totalPages:totalPages,page:1})
    } catch (error) {
        console.log(error)
        res.render('errors/500.ejs')
    }
}

const searchProducts=async(req,res)=>{
    try {
        const sort=req.sort
        // Default sorting order
        let sortCriteria = {};

        // Handle sorting options
        if (sort === 'price-low-to-high') {
            sortCriteria = { price: 1 };
        } else if (sort === 'price-high-to-low') {
            sortCriteria = { price: -1 };
        } else if (sort === 'latest') {
            sortCriteria = { lastModified: -1 }; 
        }
        
        const products= await userHelpers.findProducts(req.matchCriteria,req.skip,req.limit,sortCriteria)
        if(products){
           
            res.json({products:products,totalPages:req.totalPages,page:req.page})
        }else{
            res.json({products:false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

module.exports={
    loadShop,
    searchProducts
}