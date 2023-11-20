const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    discountPercentage: {
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
    status:{
        type:Boolean,
        default:true
    }

},{ timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
