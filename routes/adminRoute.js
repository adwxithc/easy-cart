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
const bannerController=require('../controller/bannerController')
const auth=require('../middleware/adminAuth')

const session=require('express-session')
const multer=require('multer')


//configuring view engin
admin_route.set('views','./views/admin')
admin_route.set('view engine','ejs')


//configuring session
// admin_route.use(session({
//     secret:process.env.SESSION_SECRET,
//     resave:false,
//     saveUninitialized:true
// }))

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


//seting up storage engine of banner image
const bannerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/bannerImages'))

    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname
        cb(null,name)
    }
})
const updateBannerImage=multer({storage:bannerStorage})


//parsing user req data
admin_route.use(express.urlencoded({extended:true}))
admin_route.use(express.json())


//routing

admin_route.get('/',auth.isLogout ,adminController.loadLogin);
admin_route.post('/',auth.isLogout ,adminController.verifyLogin);
admin_route.post('/logout',adminController.logout)

//admin dashboard
admin_route.get('/adminDashboard',auth.isLogin,adminController.adminDashboard);
admin_route.get('/getStats',auth.isLogin,dashboardController.getStats)
admin_route.get('/getBasicInfos',auth.isLogin,dashboardController.getBasicInfos)



//users
admin_route.get('/loadUsers',auth.isLogin,adminController.loadUsers);
admin_route.patch('/blockOrUnblockUser',auth.isLogin,adminController.blockOrUnblockUser);
admin_route.get('/searchUser',auth.isLogin,adminController.searchUser);



//product
admin_route.get('/addProduct',auth.isLogin,adminController.addProduct);
admin_route.post('/addProduct',auth.isLogin,update.array('images',4),adminController.insertProduct);
admin_route.get('/viewProducts',auth.isLogin,adminController.loadProducts);
admin_route.patch('/changeProductStatus',auth.isLogin,adminController.changeProductStatus);
admin_route.get('/viewMoreProductInfo',auth.isLogin,adminController.viewMoreProductInfo);
admin_route.get('/searchProduct',auth.isLogin,adminController.searchProduct);
admin_route.get('/editProduct',auth.isLogin,adminController.loadEditProduct);
admin_route.put('/updateProduct',auth.isLogin,update.array('images',4),validateAdminInputs.validateProductDatas,adminController.updateProductInfo);



//category
admin_route.get('/viewCategory',auth.isLogin,adminController.loadViewCategory);
admin_route.get('/categorySearch',auth.isLogin,adminController.categorySearch);
admin_route.post('/listOrUnlistCategory',auth.isLogin,adminController.listOrUnlistCategory);
admin_route.get('/loadeditCategory',auth.isLogin,adminController.loadeditCategory);
admin_route.put("/editCategory",auth.isLogin,adminController.editCategory);
admin_route.get('/addCategory',auth.isLogin,adminController.addCategory);
admin_route.post('/addCategory',auth.isLogin,adminController.insertCategory); 


//brand
admin_route.get('/loadAddBrand',auth.isLogin,adminController.loadAddBrand);
admin_route.post('/addBrand',auth.isLogin,updateLogo.single('logo'),validateAdminInputs.validateBrandData,adminController.addBrand)
admin_route.get('/loadviewBrands',auth.isLogin,adminController.loadviewBrands);
admin_route.patch('/listUnlistBrand',auth.isLogin,adminController.listUnlistBrand)
admin_route.get('/editBrand',auth.isLogin,adminController.loadeditBrand);
admin_route.put('/updateBrand',auth.isLogin,updateLogo.single('logo'),validateAdminInputs.validateUpdatedBrandData,adminController.updateBrand)


//order management
admin_route.get('/listOrders',auth.isLogin,adminController.listOrders);
admin_route.get('/viewOrder',auth.isLogin,adminController.viewOrder)
admin_route.patch('/updateOrderStatus',auth.isLogin,checkExist.orderForAdmin,validateAdminInputs.orderUpdation,adminController.updateOrderStatus)
admin_route.patch('/updateReturnStatus',auth.isLogin,checkExist.orderForAdmin,validateAdminInputs.returnStatus,adminController.updateReturnStatus)


//sales report
admin_route.get('/salesReport',auth.isLogin,reportController.loadSalesReport)

admin_route.get('/getSalesReport',auth.isLogin,validateAdminInputs.sanitiseSalesReportParam,reportController.getSalesReport)
admin_route.get('/getSalesData',auth.isLogin,reportController.getSalesData)

//coupone
admin_route.get('/getAddCoupone',auth.isLogin,couponeController.loadAddcoupone)
admin_route.post('/addCoupone',auth.isLogin,validateAdminInputs.validateCoupone,couponeController.addCoupone)
admin_route.get('/viewCoupones',auth.isLogin,couponeController.loadViewCoupones)
admin_route.get('/editCoupone',auth.isLogin,couponeController.loadEditCoupone)
admin_route.post('/updateCoupone',auth.isLogin,checkExist.coupone,validateAdminInputs.validateCoupone,couponeController.updateCoupone)
admin_route.patch('/listUnlistCoupone',auth.isLogin,checkExist.coupone,couponeController.listUnlistCoupone)

//offer

admin_route.get('/getAddOffer',auth.isLogin,offerController.loadAddOffer)
admin_route.post('/addOffer',auth.isLogin,validateAdminInputs.validateOfferData,offerController.addOffer)
admin_route.get('/viewOffers',auth.isLogin,offerController.loadViewOffers)
admin_route.get('/editOffer',auth.isLogin,offerController.loadEditOffer)
admin_route.post('/updateOffer',auth.isLogin,checkExist.offer,validateAdminInputs.validateOfferData,offerController.updateOffer)
admin_route.patch('/listUnlistOffer',auth.isLogin,checkExist.offer,offerController.listUnlistOffer)
admin_route.get('/getOffers',auth.isLogin,offerController.getOffers)
admin_route.patch('/applyOfferToProduct',auth.isLogin,checkExist.offer,checkExist.singleProduct,offerController.applyOfferToProduct)
admin_route.patch('/removeOffer',auth.isLogin,checkExist.singleProduct,offerController.removeOffer)
admin_route.patch('/applyOfferToCategory',auth.isLogin,checkExist.offer,checkExist.category,offerController.applyOfferToCategory)
admin_route.patch('/removeCategoryOffer',auth.isLogin,checkExist.category,offerController.removeCategoryOffer)


//banner
admin_route.get('/banner',auth.isLogin,bannerController.loadBanner)
admin_route.get('/addBanner',auth.isLogin,bannerController.loadAddBanner)
admin_route.post('/addBanner',auth.isLogin,updateBannerImage.single('bannerBackground'),validateAdminInputs.banner,bannerController.addBanner)
admin_route.put('/updateBannerStatus',auth.isLogin,checkExist.banner,bannerController.updateBannerStatus)
admin_route.get('/editBanner',auth.isLogin,checkExist.banner,bannerController.loadEditBanner)
admin_route.put('/updateBanner',auth.isLogin,checkExist.banner,updateBannerImage.single('bannerBackground'),validateAdminInputs.banner,bannerController.updateBanner)
admin_route.delete('/deleteBanner',auth.isLogin,checkExist.banner,bannerController.deleteBanner)

//errors
admin_route.get('/404',adminController.error404);
admin_route.get('/500',adminController.error500);



module.exports=admin_route