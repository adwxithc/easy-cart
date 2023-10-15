const Admin=require('../model/adminModel')
const Category=require('../model/categoryModel')
const User=require('../model/userModel')
const bcrypt=require('bcrypt')
const Product=require('../model/productModel')

const loadLogin=(req,res)=>{
    try {
        res.render('adminLogin')
    } catch (error) {
        console.log(error)

        
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
                req.session.adminId=Admin._id
                res.render('adminDashboard',{admin:true})

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
    }

}

//load users

const loadUsers =async(req,res)=>{
    try {
        const page=req.query.page||1// specifies which page
        
        const pagesize=req.query.pageSize||8//specifies how much data page contains

        const offset=(page-1)*pagesize//specifies how much data to be skipped
        const limit=pagesize//specifies how much data needed

        
        const users=await User.find({}).skip(offset).limit(limit)

        

        const totaluserss=await User.countDocuments()
        const totalpages=Math.ceil(totaluserss/pagesize)
        
        res.render('users',{users:users,currentPage:page,totalpages:totalpages,pagination:true}) 
        
        
    } catch (error) {
        console.log(error.message)
        
    }
}


const blockOrUnblockUser=async(req,res)=>{
    try {
        const id=req.body.id
        const userData=await User.findById(id)
        if(userData){
            if(userData.status){
                const updation=await User.updateOne({_id:id},{$set:{status:false}})
                if(updation){
                    res.json({"message":`${userData.fname+' '+userData.lname} has blocked`,"status":"blocked"})
                }else{
                    res.json({"message":"status updation failed"})
                }
            }else{
                const updation=await User.updateOne({_id:id},{$set:{status:true}})
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
    }

}

//add product

const addProduct=async(req,res)=>{
    try {
        const categories=await Category.find({})
        if(categories.length>0){
        res.render('addProduct',{categories})
        }else{
            res.render('addProduct')
        }
        
    } catch (error) {
        console.log(error.message)
        
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
        const imageArray=req?.files
        const images=[]
        for(let image of imageArray){
            images.push(image.filename)
        }
        
        if(!(name&&description&&category&&brand&&stock&&price&&size&&color&&(images.length>0))){
            
            res.json({message:"please fill all general informations"})
        }else if(isNaN(price)){
            res.json({message:"price should be a number"})

        }else{


            const check=await Product.findOne({name:name})
            console.log("check",check)
            if(check){
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
                    res.json({message:"product Successfully Created"})

                }else{
                    res.json({message:"Unable to store data"})
                }
            }
        }
        
    } catch (error) {
        console.log(error.message)
        
    }
}



// load view category

const loadViewCategory=async(req,res)=>{
    try {

        const page=req.query.page||1// specifies which page
        
        const pagesize=req.query.pageSize||5//specifies how much data page contains

        const offset=(page-1)*pagesize//specifies how much data to be skipped
        const limit=pagesize//specifies how much data needed

        
        const categories=await Category.find({}).skip(offset).limit(limit)

        

        const totalCategories=await Category.countDocuments()
        const totalpages=Math.ceil(totalCategories/pagesize)
        
        res.render('viewCategory',{categories:categories,currentPage:page,totalpages:totalpages,pagination:true})
        
        
    } catch (error) { 
        console.log(error.message)
        
    }

}
const listOrUnlistCategory=async(req,res)=>{
    try {
        
    const categoryId=req.body.categoryID

    const categoryData=await Category.findById(categoryId)

    if(categoryData){

        if(categoryData.status){
            const statusUpdate=await Category.updateOne({_id:categoryId},{$set:{status:false}})
            if(statusUpdate){
                res.json({"message":"category unlisted","status":"unlisted"})
            }else{
                res.json({"message":"category unlisting failed"})
            }
        }else{
            const statusUpdate=await Category.updateOne({_id:categoryId},{$set:{status:true}})
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
        
    }
}



const editCategory=async(req,res)=>{
    try {
        const categoryName=req.body.categoryName
        const categoryDescription=req.body.categoryDescription
        const id=req.body.id
        console.log(req.body)
        if(categoryName&&categoryDescription){
            
            
            const categoryData =await Category.findById(id)
            if(categoryData){
                const update=await Category.updateOne({_id:id},{$set:{name:categoryName,description:categoryDescription}})
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
        
    }
}



const addCategory=(req,res)=>{
    try {
        res.render('addCategory')
        
    } catch (error) {

        console.log(error.message)
        
    }
}


const insertCategory=async(req,res)=>{
    try {
        console.log(req.body)
        const name=req.body.categoryName
        const description=req.body.categoryDescription

        if(name&&description){
            const check=await Category.findOne({name:{$regex:new RegExp(req.body.categoryName,'i')}})
            
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
        
    }

}

module.exports={
    loadLogin,
    verifyLogin,
    loadUsers,
    blockOrUnblockUser,
    searchUser,
    addProduct,
    insertProduct,
    loadViewCategory,
    categorySearch,
    listOrUnlistCategory,
    loadeditCategory,
    editCategory,
    addCategory,
    insertCategory
    
}