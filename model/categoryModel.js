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

    status:{
        type:Boolean,
        default:1
    },
    unlistDate:{
        type:Date,
    }
})
module.exports=mongoose.model('Category',categorySchema)