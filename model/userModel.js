const mongoose=require('mongoose')


const userSchema=mongoose.Schema({
    fname:{
        type:String,
        required:true,
    },
    lname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        default:1
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    joinDate:{
        type:String,
        default:Date.now(),
        required:true
    },
    lastModified:{
        type:Date,
        default:Date.now()
    },
    mobile:{
        type:String,
 
    },
    address:{
        type:Array
    },
    coupones:{
        type:Array
    },
    boughtProducts:{
        type:Array

    }


})
module.exports=mongoose.model('User',userSchema)