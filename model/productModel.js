const mongoose=require('mongoose')

const ratingSchema=mongoose.Schema({
    value:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    review:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }
    
});


const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    size:{
        type:String,
        required:true,
    },
   
    description:{
        type:String,
        required:true
    },
    category:{
        type: Array,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    images:{
        type:Array,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    rating:{
        type:[ratingSchema]
    },
    addedDate:{
        type:Date,
        default:Date.now()
    },
    lastModified:{
        type:Date,
        default:Date.now()
    },
    brand:{
        type:String,
        required:true
    },
    careInstructions:String,
    material:String,
    additionalSpecifications: String,
      status:{
        type:Boolean,
        default:true
      },
      inactivatedate:{
        type:Date,
      }

})

module.exports=mongoose.model('Product',productSchema)