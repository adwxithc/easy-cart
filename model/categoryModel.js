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
    addedDate:{
        type:Date,
        default:Date.now()
    },
    lastModified:{
        type:Date,
        default:Date.now()
    },

    status:{
        type:Boolean,
        default:true
    },
    unlistDate:{
        type:Date,
    },
    offer:{
        type:mongoose.Schema.ObjectId,
        ref:'Offer'
    },
},{ timestamps: true })
module.exports=mongoose.model('Category',categorySchema)