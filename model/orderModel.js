const mongoose = require('mongoose');

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
 
  items: [{
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
    canceledByUser:{
      type:Boolean,
      default:false
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum:['COD','ONLINE-PAYMENT'],
    required: true,
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

