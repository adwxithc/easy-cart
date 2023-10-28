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
        type: [{
            type:mongoose.Schema.ObjectId,
            ref: 'Category'
        }],
        required:true
        
    },
    stock:{
        type:Number,
        required:true
    },
    reservedStock:{
        type:Number,
        default:0
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
        type:mongoose.Schema.ObjectId,
        required:true,
        ref: 'Brand'
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