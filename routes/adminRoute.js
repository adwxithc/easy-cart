const express=require('express')
const admin_route=express()
const adminController=require('../controller/adminController')
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
//seting up storage engine
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



//parsing user req data
admin_route.use(express.urlencoded({extended:true}))
admin_route.use(express.json())


//routing

admin_route.get('/',adminController.loadLogin);
admin_route.post('/',adminController.verifyLogin);
admin_route.get('/adminDashboard',adminController.adminDashboard);
admin_route.post('/logout',adminController.logout)

admin_route.get('/loadUsers',adminController.loadUsers);
admin_route.patch('/blockOrUnblockUser',adminController.blockOrUnblockUser);
admin_route.get('/searchUser',adminController.searchUser);

admin_route.get('/addProduct',adminController.addProduct);
admin_route.post('/addProduct',update.array('images',4),adminController.insertProduct);
admin_route.get('/viewProducts',adminController.loadProducts);
admin_route.patch('/changeProductStatus',adminController.changeProductStatus);
admin_route.get('/viewMoreProductInfo',adminController.viewMoreProductInfo);
admin_route.get('/searchProduct',adminController.searchProduct);
admin_route.get('/editProduct',adminController.loadEditProduct);
admin_route.put('/updateProduct',update.fields([{name:'image0'},{name:'image1'},{name:'image2'},{name:'image3'}]),adminController.updateProductInfo);



admin_route.get('/viewCategory',adminController.loadViewCategory);
admin_route.get('/categorySearch',adminController.categorySearch);

admin_route.post('/listOrUnlistCategory',adminController.listOrUnlistCategory);
admin_route.get('/loadeditCategory',adminController.loadeditCategory);
admin_route.put("/editCategory",adminController.editCategory);


admin_route.get('/addCategory',adminController.addCategory);
admin_route.post('/addCategory',adminController.insertCategory);

admin_route.get('/404',adminController.error404);
admin_route.get('/500',adminController.error500);


 admin_route.use('*',(req,res)=>{
    res.status(404).render('errors/404')

 })

module.exports=admin_route