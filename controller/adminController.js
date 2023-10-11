const Admin=require('../model/adminModel')
const Category=require('../model/categoryModel')
const bcrypt=require('bcrypt')

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
        
        res.render('viewCategory',{admin:true,categories:categories,currentPage:page,totalpages:totalpages})
        
        
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

const addCategory=(req,res)=>{
    try {
        res.render('addCategory',{admin:true})
        
    } catch (error) {

        console.log(error.message)
        
    }
}


const insertCategory=async(req,res)=>{
    try {
        console.log(req.body)
        const name=req.body.categoryName
        const description=req.body.categoryDescription
        const title=req.body.metaTitle
        const metaDescription=req.body.metaDescription
        const keyword=req.body.keywords
        if(name&&description){
            const check=await Category.findOne({name:{$regex:new RegExp(req.body.categoryName,'i')}})
            
            if(!check){
                const categor=new Category({
                    name:name,
                    description:description,
                    metaTitle:title,
                    metaDescription:metaDescription,
                    keywords:keyword
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
        res.json({"message":"Please enter atleast name and description of category"})
    }
    } catch (error) {
        console.log(error.message)
        
    }

}

module.exports={
    loadLogin,
    verifyLogin,
    loadViewCategory,
    listOrUnlistCategory,
    addCategory,
    insertCategory
    
}