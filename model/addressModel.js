const mongoose = require('mongoose');

// Define a Mongoose Schema for the address
const addressSchema = new mongoose.Schema({
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
    
},{ timestamps: true });


module.exports=mongoose.model('Address',addressSchema)
