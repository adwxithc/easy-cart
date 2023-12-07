const mongoose=require('mongoose')


const walletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 0
    },
    transactions: [
        {
            type: {
                type: String,
                enum: ['credit', 'debit']
            },
            amount: {
                type: Number,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            order_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            },
            transaction_id:{
                type:String,
                required:true
            },
            description: String
        }
    ]
});


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

    },
    wallet: {
        type: walletSchema, // Embed the wallet schema in the User schema
        default: {}
    },
    referCode:{
        type:String,
        
    }


},{ timestamps: true })



module.exports=mongoose.model('User',userSchema)

