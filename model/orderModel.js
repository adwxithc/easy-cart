const mongoose = require('mongoose');

const orderItemSchema=new mongoose.Schema({
  
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered','Canceled'],
      default:'Pending'
    },
    paymentStatus:{
      type:String,
      required:true,
      enum:['pending','received','refunded'],
      default:'pending'
    },
    discount:{
      type:Number,
      default:0
    },
    MRP:{
      type:Number,
      default:0

    },
    returnStatus:{ 
      type:String,
      enum:['returnPlaced','outForPick','returned']
    },
    eligibleForReturn:{
      type:Boolean,
      default:true
    },
    returnReason:{
      type:String,
    }

  
},{ timestamps: { createdAt: 'itemCreatedAt', updatedAt: 'itemUpdatedAt' } })

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
 
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum:['COD','ONLINE-PAYMENT','WALLET'],
    required: true,
  },
  couponeDiscount:{
    type:Number,
    default:0
  },
  couponeId:{
    type:mongoose.Schema.Types.ObjectId,
    default:null
  },
  shippingAddress: {
    user:{
      type:mongoose.Schema.ObjectId ,
      required:true
    },
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    locality: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['home', 'work'],
        default:'home'

    },
    landmark: String,
    alternatePhone: Number,
  },
 
},{ timestamps: true });

module.exports= mongoose.model('Order', orderSchema);

