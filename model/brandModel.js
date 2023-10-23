const mongoose=require('mongoose')

const brandSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:true
    },
    addedDate:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:Boolean,
        default:true
    },
    lastModified:{
        type:String,
        default:Date.now()
    }
})

module.exports=mongoose.model('Brand',brandSchema)