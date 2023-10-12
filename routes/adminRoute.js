const express=require('express')
const admin_route=express()
const adminController=require('../controller/adminController')

const session=require('express-session')


//configuring view engin
admin_route.set('views','./views/admin')
admin_route.set('view engine','ejs')


//configuring session
admin_route.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))



//parsing user req data
admin_route.use(express.urlencoded({extended:true}))
admin_route.use(express.json())

admin_route.get('/',adminController.loadLogin);
admin_route.post('/',adminController.verifyLogin);

admin_route.get('/loadUsers',adminController.loadUsers)
admin_route.patch('/blockOrUnblockUser',adminController.blockOrUnblockUser)

admin_route.get('/viewCategory',adminController.loadViewCategory)
admin_route.get('/categorySearch',adminController.categorySearch)

admin_route.post('/listOrUnlistCategory',adminController.listOrUnlistCategory);
admin_route.get('/loadeditCategory',adminController.loadeditCategory);
admin_route.put("/editCategory",adminController.editCategory)


admin_route.get('/addCategory',adminController.addCategory);
admin_route.post('/addCategory',adminController.insertCategory);

 

module.exports=admin_route