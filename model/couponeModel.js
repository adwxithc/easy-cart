const mongoose = require('mongoose');

const discountCouponeSchema = new mongoose.Schema({
    couponeCode: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        trim: true,
    },
    minPurchaseAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    maxPurchaseAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    couponeDiscount: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    startDate: {
        type: Date,
        required: true,
    },
    expireDate: {
        type: Date,
        required: true,
    },
    quantity:{
        type:Number,
        default:1
    },
    status:{
        type:Boolean,
        default:true
    },
    appliedUsers:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }]
    }
},{ timestamps: true });


module.exports = mongoose.model('DiscountCoupone', discountCouponeSchema);;
