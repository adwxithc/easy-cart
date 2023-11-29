const express=require('express')
const admin_route=express()
const adminController=require('../controller/adminController')
const validateAdminInputs=require('../middleware/validateAdminInputs')
const path=require('path')
const dashboardController=require('../controller/dashboardController')
const reportController=require('../controller/reportController')
const couponeController=require('../controller/couponeController')
const checkExist=require('../middleware/checkExist')
const offerController=require('../controller/offerController')

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
admin_route.post('/logout',adminController.logout)

//admin dashboard
admin_route.get('/adminDashboard',adminController.adminDashboard);
admin_route.get('/getStats',dashboardController.getStats)
admin_route.get('/getBasicInfos',dashboardController.getBasicInfos)



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
admin_route.patch('/updateOrderStatus',checkExist.orderForAdmin,validateAdminInputs.orderUpdation,adminController.updateOrderStatus)
admin_route.patch('/updateReturnStatus',checkExist.orderForAdmin,validateAdminInputs.returnStatus,adminController.updateReturnStatus)


//sales report
admin_route.get('/salesReport',reportController.loadSalesReport)

admin_route.get('/getSalesReport',validateAdminInputs.sanitiseSalesReportParam,reportController.getSalesReport)
admin_route.get('/getSalesData',reportController.getSalesData)

//coupone
admin_route.get('/getAddCoupone',couponeController.loadAddcoupone)
admin_route.post('/addCoupone',validateAdminInputs.validateCoupone,couponeController.addCoupone)
admin_route.get('/viewCoupones',couponeController.loadViewCoupones)
admin_route.get('/editCoupone',couponeController.loadEditCoupone)
admin_route.post('/updateCoupone',checkExist.coupone,validateAdminInputs.validateCoupone,couponeController.updateCoupone)
admin_route.patch('/listUnlistCoupone',checkExist.coupone,couponeController.listUnlistCoupone)

//offer

admin_route.get('/getAddOffer',offerController.loadAddOffer)
admin_route.post('/addOffer',validateAdminInputs.validateOfferData,offerController.addOffer)
admin_route.get('/viewOffers',offerController.loadViewOffers)
admin_route.get('/editOffer',offerController.loadEditOffer)
admin_route.post('/updateOffer',checkExist.offer,validateAdminInputs.validateOfferData,offerController.updateOffer)
admin_route.patch('/listUnlistOffer',checkExist.offer,offerController.listUnlistOffer)
admin_route.get('/getOffers',offerController.getOffers)
admin_route.patch('/applyOfferToProduct',checkExist.offer,checkExist.singleProduct,offerController.applyOfferToProduct)
admin_route.patch('/removeOffer',checkExist.singleProduct,offerController.removeOffer)
admin_route.patch('/applyOfferToCategory',checkExist.offer,checkExist.category,offerController.applyOfferToCategory)
admin_route.patch('/removeCategoryOffer',checkExist.category,offerController.removeCategoryOffer)

//errors
admin_route.get('/404',adminController.error404);
admin_route.get('/500',adminController.error500);


 admin_route.use('*',(req,res)=>{
    res.status(404).render('errors/404') 

 })

module.exports=admin_route