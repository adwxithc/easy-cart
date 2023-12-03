const Product=require('../model/productModel')
const Category=require('../model/categoryModel')
const Brands=require('../model/brandModel')
const userHelpers=require('../helperMethods/userHelpers')
const Cart=require('../model/cartModel')
const asyncErrorHandler=require('../Utils/asyncErrorHandler')
const { default: mongoose } = require('mongoose')

//LOAD SHOP PAGE
const loadShop=asyncErrorHandler( async(req,res, next)=>{

    const cart=req.cart;
    // GETING ANY FIRST 12 PRODUCTS
    const products=await Product.aggregate([
        {
            $limit:12
        },
    ])

    //FIND TOTAL PAGE FOR PAGINATION
    const totalProducts = await Product.countDocuments();
    const totalPages=Math.ceil(totalProducts/12)

    //GETTING FILTERING DETAILS
    const categories=await Category.find({status:true},{name:1})
    const brands=await Brands.find({status:true},{name:1})
    
    res.render('shop',{products:products,categories:categories,brands:brands,totalPages:totalPages,cart:cart,page:1})

});

const searchProducts=asyncErrorHandler( async(req,res, next)=>{

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

            res.json({products:products,totalPages:req.totalPages,page:req.page,cart:req.cart})
        }else{
            res.json({products:false})
        }
});

module.exports={
    loadShop,
    searchProducts
}