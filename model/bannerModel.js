const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    miniTitle: {
        type: String,
        required: true,
        trim: true,
    },
    mainTitle: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        trim: true,
    },
    bannerBackground: {
        type: String, 
        required: true,
    },
    status:{
        type:Boolean,
        default:true
    },
    deleted:{
        type:Boolean,
        default:false
    }
},{ timestamps: true });



module.exports = mongoose.model('Banner',bannerSchema);
