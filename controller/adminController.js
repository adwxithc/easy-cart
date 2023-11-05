const Admin=require('../model/adminModel')
const Category=require('../model/categoryModel')
const User=require('../model/userModel')
const bcrypt=require('bcrypt')
const Product=require('../model/productModel')
const fs=require('fs')
const Brand =require('../model/brandModel')
const Order=require('../model/orderModel')
const ObjectId = require('mongodb').ObjectId;

const loadLogin=(req,res)=>{
    try {
        res.render('adminLogin')

    } catch (error) {
        console.log(error.message)
        res.status(500).render('errors/500.ejs',{hideRedirect:true})

        
    }
}

const verifyLogin=async(req,res)=>{
    try {
        
        const email=req.body.email
        const password=req.body.password
        if(email&&password){
        const adminData=await Admin.findOne({email:email})
        if(adminData){
            const hashedPassword=adminData.password
            const passwordCheck=await bcrypt.compare(password,hashedPassword)
            if(passwordCheck){
                req.session.adminId=adminData._id 
                res.redirect('/admin/adminDashboard')

            }else{
                res.render('adminLogin',{message:"invalid email or password combination"})
            }

        }else{
            res.render('adminLogin',{message:"invalid email or password combination"})
        }
    }else{
        res.render('adminLogin',{message:"Please enter all the fields"})
    
    }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).render('errors/500.ejs',{hideRedirect:true})
    }

}

const adminDashboard=async(req,res)=>{
    try {
        res.render('adminDashboard',{admin:true})
        
    } catch (error) {
        res.status(500)
        
    }

}

//adminlogout
const logout=async(req,res)=>{
    try {
            req.session.destroy((er)=>{
            if(er) console.log(er.message)//send status
            else res.redirect('/admin')
        })
        
    } catch (error) {
        res.status(500).render('errors/500.ejs',{redirect:true})
    }
}

//load users

const loadUsers =async(req,res)=>{
    try {
        
        
        const page=req.query.page||1// specifies which page
        
        const pagesize=req.query.pageSize||8//specifies how much data page contains

        const offset=(page-1)*pagesize//specifies how much data to be skipped
        const limit=pagesize//specifies how much data needed

        
        const users=await User.find({}).sort({lastModified:-1}).skip(offset).limit(limit)

        

        const totaluserss=await User.countDocuments()
        const totalpages=Math.ceil(totaluserss/pagesize)
        
        res.render('users',{users:users,currentPage:page,totalpages:totalpages,pagination:true}) 
        
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server Error"})
    }
}


const blockOrUnblockUser=async(req,res)=>{
    try {
        const id=req.body.id
        const userData=await User.findById(id)
        if(userData){
            if(userData.status){
                const updation=await User.updateOne({_id:id},{$set:{status:false,lastModified:Date.now()}})
                if(updation){
                    res.json({"message":`${userData.fname+' '+userData.lname} has blocked`,"status":"blocked"})
                }else{
                    res.json({"message":"status updation failed"})
                }
            }else{
                const updation=await User.updateOne({_id:id},{$set:{status:true,lastModified:Date.now()}})
                if(updation){
                    res.json({"message":`${userData.fname+' '+userData.lname} has unblocked`,"status":"unblocked"})
                }else{
                    res.json({"message":"status updation failed"})
                }
            }
            
        }else{
            res.json({"message":"User Doesn't Exist"})

        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
    }

}


//user Search

const searchUser=async(req,res)=>{
    try {
        console.log(req.query.key)
        const users=await User.find({fname:{$regex:new RegExp(`^${req.query.key}`,'i')}})

        if(users.length>0){
        res.render('users',{users:users,key:req.query.key})
        }else{
            res.json({message:`No user exist with name ${req.query.key}`})
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
    }

}

//add product

const addProduct=async(req,res)=>{
    try {
        const categories=await Category.find({status:true})
        const brands=await Brand.find({status:true})
        if(categories.length>0){
        res.render('addProduct',{categories,brands})
        }else{
            res.render('addProduct')
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }
}

const insertProduct=async(req,res)=>{
    try {
       

        const name=req.body.name
        const description=req.body.description
        const category=req.body.category
        const brand=req.body.brand
        const stock=req.body.stock
        const price=req.body.price
        const size=req.body.size
        const color=req.body.color
        const careInstructions=req.body.careInstructions
        const material=req.body.material
        const additionalSpecifications=req.body.additionalSpecifications
        const imageArray=req.files
        const images=[]
        for(let image of imageArray){
            images.push(image.filename)
        }
        
        if(!(name&&description&&category&&brand&&stock&&price&&size&&color&&(images.length>0))){
            
            res.json({message:"please fill all general informations"})
        }else if(isNaN(price)){
            res.json({message:"price should be in number"})

        }else if(isNaN(stock)){
            res.json({message:"stocks should be in number"})

        }else{


            const check=await Product.findOne({name:name})
            
            if(check&&(check.color==color)&&(check.size==size)&&(check.brand==brand)){
                res.json({message:"This product already exist"})
            }else{
                const product=new Product({
                    name:name,
                    description:description,
                    category:category,
                    brand:brand,
                    stock:stock,
                    price:price,
                    size:size,
                    color:color,
                    careInstructions:careInstructions,
                    material:material,
                    additionalSpecifications:additionalSpecifications,
                    images:images
                })
                const inserted=await product.save()
                if(inserted){
                    res.json({message:"product Successfully Created",success:true})

                }else{
                    res.json({message:"Unable to store data"})
                }
            }
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }
}

// load view products

const loadProducts=async(req,res)=>{
try {
    

        const page=req.query.page||1// specifies which page
        
        const pagesize=req.query.pageSize||7//specifies how much data page contains

        const offset=(page-1)*pagesize//specifies how much data to be skipped
        const limit=pagesize//specifies how much data needed
        
        
        const products=await Product.find({}).sort({lastModified:-1}).skip(offset).limit(limit)

        

        const totalProducts=await Product.countDocuments()
        const totalpages=Math.ceil(totalProducts/pagesize)
        
        
        
        res.render('viewProducts',{products:products,currentPage:page,totalpages:totalpages,pagination:true})
        



    
} catch (error) {
    console.log(error.message);
    res.status(500).json({message:"internal server error"})
    
}
}

//activate or inactivate product 
const changeProductStatus=async(req,res)=>{
    try{
        const id=req.body.productId
        const productData=await Product.findById(id)
        if(productData){
            
            if(productData.status){
                
                const updated=await Product.updateOne({_id:id},{$set:{status:false,inactivatedate:Date.now(),lastModified:Date.now()}})
                if(updated){
                    res.json({message:"Product has inactivated" ,status:"inactivated"})

                }else{
                    res.json({message:"failed to inactivate product"})

                }

            }else{
                const updated=await Product.updateOne({_id:id},{$set:{status:true,inactivatedate:null,lastModified:Date.now()}})
                if(updated){
                    res.json({message:"Product has activated",status:"activated"})

                }else{
                    res.json({message:"failed to activate product"})

                }

            }

        }else{
            res.json({message:"This product doesn't exist"})
        }
        

        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }
}


const viewMoreProductInfo= async(req,res)=>{ 
    try {

        const id=req.query.productId
        const categories=await Category.find({},{name:1})
        const productData=await Product.findById(id)
        const brand=await Brand.findById(productData.brand)

        res.render('productInfo',{productData:productData,categories:categories,brand:brand}) 

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }
}
//-------------------searchProduct-----------
const searchProduct=async(req,res)=>{

    try {


        const field=req.query.field;
        const key=req.query.key||null;

        if(field=='category'){
            const productData=await Product.find({category:{
                $elemMatch:{
                    $regex:new RegExp(`^${key}`,'i')
                }
            }})
            console.log(productData.length)
            if(productData.length>0){
              
                
                res.render('viewProducts',{products:productData,key:key})
            }else{
                res.json({message:"No product found"})
            }

        }else if(field=='brand'){
            const productData=await Product.find({brand:{$regex:new RegExp(`^${key}`,'i')}})
            console.log(productData.length)
            if(productData.length>0){

             
                
                res.render('viewProducts',{products:productData,key:key})
            }else{
                res.json({message:"No product found"})
            }
        }else{
            const productData=await Product.find({name:{$regex:new RegExp(`^${key}`,'i')}})
            console.log(productData.length)
            if(productData.length>0){
             
                
                res.render('viewProducts',{products:productData,key:key})
            }else{
                res.json({message:"No product found"})
            }

        }
        
        
        console.log(key,field)
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }
}



//load edit product
const loadEditProduct=async(req,res)=>{
    try {
        const id=req.query.id
        
        const productData=await Product.findById(id)
        const categories=await Category.find()
        const brands=await Brand.find()
        if(productData){ 
            
            res.render('editProduct',{productData:productData,categories:categories,brands:brands})
        }else{
            res.status(404).json({message:"This product doesn't exist"})
        }
        
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }
}

//update edited product info
const updateProductInfo=async(req,res)=>{
    try {
       

        const id=req.body.id 
        const name=req.body.name;
        const description=req.body.description;
        const category=req.body.category;
        const brand=req.body.brand;
        const stock=req.body.stock;
        const price=req.body.price;
        const size=req.body.size;
        const color=req.body.color;
        const careInstructions=req.body.careInstructions;
        const material=req.body.material;
        const additionalSpecifications=req.body.additionalSpecifications;

        if(!(name&&description&&category&&brand&&stock&&price&&size&&color)){
            res.json({message:"You must provide all general informations"})

        }else if(isNaN(stock)){
            res.json({message:"stock must be in number"})
        }else if(isNaN(price)){
            res.json({message:"price must be in number"})
        }else{


            const productData=await Product.findById(id)
            if(productData){

                const originalProductData = { ...productData._doc };

                
                
                const dataUpdated=await Product.updateOne(
                    {_id:id},
                    {
                        $set:{

                            name:name,
                            description:description,
                            category:category,
                            brand:brand,
                            stock:stock,
                            price:price,
                            size:size,
                            color:color,
                            careInstructions:careInstructions,
                            material:material,
                            additionalSpecifications:additionalSpecifications,
                            lastModified:Date.now()
                        }
                    }
                    )

                    
                if(dataUpdated){

                    const replacedImg=[] //old images
                    const newImges=[]  //new images

                    const imagesName=[req.files['image0'],req.files['image1'],req.files['image2'],req.files['image3']]
                    for(let i=0;i<imagesName.length;i++){

                    if(imagesName[i]){
                        
                        newImges.push(imagesName[i][0])
                        if( productData && productData.images[i] )  replacedImg.push(productData.images[i]);


                        
                            const ImgUpdate = await Product.updateOne(
                                { _id: id},
                                {
                                    $set: {
                                            [`images.${i}`]: imagesName[i][0].filename,
                                        },
                                }
                            );

                            if(!ImgUpdate){
                                await Product.updateOne({ _id: id }, { $set: originalProductData });

                                newImges.forEach((v,i)=>{
                                    const path=`./public/productImages/${v}`
                                    fs.unlink(path,(err)=>{
                                        if(err){
                                            console.log(err.message)
                                        }else{
                                            console.log("old image removed")
                                        }
                                    })

                                })


                                res.status(500).json({message:"failed to update product image"})

                            }


                        }
                    }


                        replacedImg.forEach((v,i)=>{
                            const path=`./public/productImages/${v}`
                            fs.unlink(path,(err)=>{
                                if(err){
                                    console.log(err.message)
                                }else{
                                    console.log("old image removed")
                                }
                            })
                        })

                        res.json({message:"Product updated successfully"})



                }else{
                    res.status(500).json({message:"This product updation failed"})
                }
                


            }else{
                res.status(404).json({message:"this product doesn't exist"})
            }
        }
        
       

        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }
}


// load view category

const loadViewCategory=async(req,res)=>{
    try {

        const page=req.query.page||1// specifies which page
        
        const pagesize=req.query.pageSize||5//specifies how much data page contains

        const offset=(page-1)*pagesize//specifies how much data to be skipped
        const limit=pagesize//specifies how much data needed

        
        const categories=await Category.find({}).sort({lastModified:-1}).skip(offset).limit(limit)

        

        const totalCategories=await Category.countDocuments()
        const totalpages=Math.ceil(totalCategories/pagesize)
        
        res.render('viewCategory',{categories:categories,currentPage:page,totalpages:totalpages,pagination:true})
        
        
    } catch (error) { 
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }

}
const listOrUnlistCategory=async(req,res)=>{
    try {
        
    const categoryId=req.body.categoryID

    const categoryData=await Category.findById(categoryId)

    if(categoryData){

        if(categoryData.status){
            const statusUpdate=await Category.updateOne({_id:categoryId},{$set:{status:false,unlistDate:Date.now(),lastModified:Date.now()}})
            if(statusUpdate){
                res.json({"message":"category unlisted","status":"unlisted"})
            }else{
                res.json({"message":"category unlisting failed"})
            }
        }else{
            const statusUpdate=await Category.updateOne({_id:categoryId},{$set:{status:true,unlistDate:null,lastModified:Date.now()}})
            if(statusUpdate){
                res.json({"message":"category listed","status":"listed"})
            }else{
                res.json({"message":"category listing failed"})
            }
        }

       
    }else{
        res.json({"message":"This category doest'n exist"})

    }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }

}

//category Search

const categorySearch=async(req,res)=>{
    try {
        
        const categories=await Category.find({name:{$regex:new RegExp(`^${req.query.key}`,'i')}})
        
        if(categories.length>0){
        res.render('viewCategory',{categories:categories,key:req.query.key})
        }else{
            
            res.json({"message":`No Category Exist with name ${req.query.key}`})
        }

        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
    }

}

const loadeditCategory=async(req,res)=>{
    try {
        const id=req.query.id
        const categoryData=await Category.findById(id)
        if(categoryData){
            res.render('editCategory',{categoryData:categoryData})

        }else{
            res.json({"message":"This category not found"})
        }
        
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }
}



const editCategory=async(req,res)=>{
    try {
        const categoryName=req.body.categoryName
        const categoryDescription=req.body.categoryDescription
        const id=req.body.id
        
        if(categoryName&&categoryDescription){
            
            
            const categoryData =await Category.findById(id)
            if(categoryData){
                const update=await Category.updateOne({_id:id},{$set:{name:categoryName,description:categoryDescription,lastModified:Date.now()}})
                if(update){
                    res.json({"message":"Category Updated"})

                }else{
                    res.json({"message":"Data Updation Failed"})
                }

            }else{
                res.json({"message":"Provided category doesn't exist"})
            }
            
        }else{
            res.json({"message":"Please fill all the fealds"})
        }


    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }
}



const addCategory=(req,res)=>{
    try {
        
        res.render('addCategory')
        
    } catch (error) {

        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }
}


const insertCategory=async(req,res)=>{
    try {
        console.log(req.body)
        const name=req.body.categoryName
        const description=req.body.categoryDescription

        if(name&&description){
            const check=await Category.findOne({name:{$regex:new RegExp(`^${req.body.categoryName}`,'i')}})
            
            if(!check){
                const categor=new Category({
                    name:name,
                    description:description,

                })
                const categoryData=await categor.save()
                if(categoryData){
                    res.json({"message":"New Catrgory Created","success":true})
                }else{
                    res.json({"message":"Unable To Add New Catrgory"})
                }

            }else{
                res.json({"message":"This category already exists"})
            }
        
    }else{
        res.json({"message":"Please enter  name and description of the category"})
    }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
        
    }

}


// load add brand

const loadAddBrand=(req,res)=>{
    try {

        res.render('addBrand')
        
    } catch (error) {
        res.status(500).json({message:"internal server error"}) 
        console.log(error.message)
        
    }
}

const addBrand=async(req,res)=>{
    try {
        const brand=new Brand(req.brandData)
        const added=await brand.save()
        if(added){
            res.json({message:"brand added successfully",success:true})
        }else{
            res.status(500).json({message:"Unable to add brand"})
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})

        
    }
}

//load view brands
const loadviewBrands=async(req,res)=>{

    try {
        
        const page=req.query.page||1// specifies which page
        const pagesize=req.query.pageSize||5//specifies how much data page contains

        const offset=(page-1)*pagesize//specifies how much data to be skipped
        const limit=pagesize//specifies how much data needed

        
        const brands=await Brand.find({}).sort({lastModified:-1}).skip(offset).limit(limit)

        

        const totalBrands=await Brand.countDocuments()
        const totalpages=Math.ceil(totalBrands/pagesize)
        
        res.render('viewBrands',{brands:brands,currentPage:page,totalpages:totalpages,pagination:true})        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})

        
    }
}

//list or unlist brand

const listUnlistBrand=async(req,res)=>{
    try {
        const id=req.body.id

        const brand=await Brand.findOne({_id:id})
        if(brand){
            const message=brand.status?'The brand has been unlisted':'The brand has been listed'
            
            brand.status=!brand.status;
            brand.lastModified=Date.now();
            const updated=await brand.save()
            if(updated){
                res.json({message:message,brandStatus: brand.status})
            }else{
                res.json({message:"Unable to change the status of the brand"})
            }

        }else{
            res.json({message:"This brand doesn't exist"})
        }


    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})

    }
}

//load editbrand

const loadeditBrand=async(req,res)=>{
    try {
        const brand=await Brand.findById(req.query.id)
        if(brand){
            res.render('editBrand',{brand:brand})

        }else{
            res.json({message:"This brand doesn't exist"})
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"internal server error"})
    }

}

// update brand data

const updateBrand=async(req,res)=>{
    try {
     
        const updated=await Brand.updateOne({_id:req.body.id},{$set:req.brandData})
        if(updated){
           
            
            if(req.originalbrandData){
               
                
                const path=`./public/brandImages/${ req.originalbrandData.logo}`

                fs.unlink(path,async (err)=>{
                    if(err){

                        await Product.updateOne({ _id: id }, { $set: originalProductData });

                        console.log(err.message)
                        res.status(500).json({message:"internal server error"})
    
                    }else{
                        console.log('old logo deleted')
                        res.json({message:"Brand datas updated successfully"})
                   }
                })

            }else{
                res.json({message:"Brand datas updated successfully"})
            }




        }else{
            console.log('unable to update brand data')
            res.json({message:"unable to update brand data"})
        }


        
    } catch (error) {
        console.log(error.message)
        
    }

}


//list orders

const listOrders=async(req,res)=>{
    try {
        const page=req.query.page||1// specifies which page
        const pagesize=req.query.pageSize||5//specifies how much data page contains

        const offset=(page-1)*pagesize//specifies how much data to be skipped
        const limit=pagesize//specifies how much data needed

        
        const orders=await Order.find({}).sort({updatedAt:-1}).skip(offset).limit(limit)
        .populate({
            path: 'items.product',
            select: 'name',
            })

        

        const totalOrdes=await Order.countDocuments()
        const totalpages=Math.ceil(totalOrdes/pagesize)

        
        
        res.render('listOrders',{orders:orders,currentPage:page,totalpages:totalpages,pagination:true})      

        
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
        
    }
}
const viewOrder=async(req,res)=>{
    try {
        
        
        const orderData = await Order.findOne({ _id: req.query.orderId })
        .populate({
          path: 'items.product',
          select: 'color images name size',
          populate: {
            path: 'brand',
            select: 'name',
          },
        })
        .populate({
          path: 'customer',
          select: 'fname lname email mobile',
        });
        console.log(orderData)


        res.render('orderDetails',{orderData:orderData})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}

// updateOrderStatus

const updateOrderStatus=async(req,res)=>{
    try {

        const order=await Order.findById(req.body.orderId)
        if(order){
            let notCanceled=false,quantity;
            for(let item of order.items){
                if(item.product==req.body.productId){
                    if(item.orderStatus!='Canceled'){
                        item.orderStatus=req.body.newStatus
                        notCanceled=true
                        quantity=item.quantity
                    }
                }
            }
            if(notCanceled){
                const updatedOrder=await order.save()
                if(updatedOrder){
                    if(req.body.newStatus=='Canceled'){
                        await Product.updateOne({_id:req.body.productId},{$inc:{stock:quantity}})
                    }
                    res.json({message:'Order status  updated successfully',updated:true})
                }else{
                    res.json({message:'Order status  updation failed ',updated:false})
                }
                
            }else{
                res.json({message:'This is a canceled order ',updated:false})
            }
        }else{
            res.json({message:"This order doesn't exist ",updated:false})
        }
 
        // const updatedOrder = await Order.findOneAndUpdate(
        //     { _id: req.body.orderId, 'items.product': req.body.productId },
        //     { $set: { 'items.$.orderStatus': req.body.newStatus } },
        //     { new: true }
        //   );
        //   console.log(updatedOrder)
        //   if(updatedOrder){
        //     if(req.body.newStatus=='Canceled'){
        //         for(let item of updatedOrder.items){
        //             if(item.product==req.body.productId){
        //                 await Product.updateOne({_id:req.body.productId},{$inc:{stock:item.quantity}})
        //             }
        //         }
                
        //       }
        //      res.json({updated:true,message:'Order status updated successfully'})

        //   }else{
        //     res.json({message:'unable to update order status',updated:false})
        //   }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal server error'})
    }
}


//error page rendering route

const error404=(req,res)=>{
    res.status(404).render('errors/404')

}

const error500=(req,res)=>{
    res.status(500).render('errors/500')

}

module.exports={
    loadLogin,
    verifyLogin,
    adminDashboard,
    logout,

    loadUsers,
    blockOrUnblockUser,
    searchUser,

    addProduct,
    insertProduct,
    loadProducts,
    changeProductStatus,
    viewMoreProductInfo,
    searchProduct,
    loadEditProduct,
    updateProductInfo,

    loadViewCategory,
    categorySearch,
    listOrUnlistCategory,
    loadeditCategory,
    editCategory,
    addCategory,
    insertCategory,

    loadAddBrand,
    addBrand,
    loadviewBrands,
    listUnlistBrand,
    loadeditBrand,
    updateBrand,

    listOrders,
    viewOrder,
    updateOrderStatus,

    error404,
    error500
    
}