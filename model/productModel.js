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
    
},{ timestamps: { createdAt: 'ratingCreatedAt', updatedAt: 'ratingUpdatedAt' } });


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
    offer:{
        type:mongoose.Schema.ObjectId,
        ref:'Offer'
    },
    effectedDiscount:{
        type:Number,
        default:0
    },
    effectedOfferStartDate:{
        type:Date
    },
    effectedOfferEndDate:{
        type:Date
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

},{ timestamps: true })

module.exports=mongoose.model('Product',productSchema)