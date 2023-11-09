const express=require('express')
const admin_route=express()
const adminController=require('../controller/adminController')
const validateAdminInputs=require('../middleware/validateAdminInputs')
const path=require('path')

const session=require('express-session')
const multer=require('multer')


//configuring view engin
admin_route.set('views','./views/admin')
admin_route.set('view engine','ejs')


//configuring session
admin_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))

//
//seting up storage engine for product images
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/productImages'))

    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname
        cb(null,name)
    }
})

const update=multer({storage:storage})


//seting up storage engine of brand logo
const brandStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/brandImages'))

    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname
        cb(null,name)
    }
})
const updateLogo=multer({storage:brandStorage})


//parsing user req data
admin_route.use(express.urlencoded({extended:true}))
admin_route.use(express.json())


//routing

admin_route.get('/',adminController.loadLogin);
admin_route.post('/',adminController.verifyLogin);
admin_route.get('/adminDashboard',adminController.adminDashboard);
admin_route.post('/logout',adminController.logout)



//users
admin_route.get('/loadUsers',adminController.loadUsers);
admin_route.patch('/blockOrUnblockUser',adminController.blockOrUnblockUser);
admin_route.get('/searchUser',adminController.searchUser);



//product
admin_route.get('/addProduct',adminController.addProduct);
admin_route.post('/addProduct',update.array('images',4),adminController.insertProduct);
admin_route.get('/viewProducts',adminController.loadProducts);
admin_route.patch('/changeProductStatus',adminController.changeProductStatus);
admin_route.get('/viewMoreProductInfo',adminController.viewMoreProductInfo);
admin_route.get('/searchProduct',adminController.searchProduct);
admin_route.get('/editProduct',adminController.loadEditProduct);
admin_route.put('/updateProduct',update.array('images',4),validateAdminInputs.validateProductDatas,adminController.updateProductInfo);




//category
admin_route.get('/viewCategory',adminController.loadViewCategory);
admin_route.get('/categorySearch',adminController.categorySearch);
admin_route.post('/listOrUnlistCategory',adminController.listOrUnlistCategory);
admin_route.get('/loadeditCategory',adminController.loadeditCategory);
admin_route.put("/editCategory",adminController.editCategory);
admin_route.get('/addCategory',adminController.addCategory);
admin_route.post('/addCategory',adminController.insertCategory); 


//brand
admin_route.get('/loadAddBrand',adminController.loadAddBrand);
admin_route.post('/addBrand',updateLogo.single('logo'),validateAdminInputs.validateBrandData,adminController.addBrand)
admin_route.get('/loadviewBrands',adminController.loadviewBrands);
admin_route.patch('/listUnlistBrand',adminController.listUnlistBrand)
admin_route.get('/editBrand',adminController.loadeditBrand);
admin_route.put('/updateBrand',updateLogo.single('logo'),validateAdminInputs.validateUpdatedBrandData,adminController.updateBrand)

//order management
admin_route.get('/listOrders',adminController.listOrders);
admin_route.get('/viewOrder',adminController.viewOrder)
admin_route.patch('/updateOrderStatus',adminController.updateOrderStatus)

//errors
admin_route.get('/404',adminController.error404);
admin_route.get('/500',adminController.error500);


 admin_route.use('*',(req,res)=>{
    res.status(404).render('errors/404') 

 })

module.exports=admin_route