const mongoose=require('mongoose')

const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    metaTitle:{
        type:String,
        
    },
    metaDescription:{
        type:String,
        
    },
    keywords:{
        type:String,
        
    },
    status:{
        type:Boolean,
        default:1
    },
    delete:{
        type:Date,
    }
})
module.exports=mongoose.model('Category',categorySchema)