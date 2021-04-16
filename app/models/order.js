const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customerId : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Which model is our reference
        required: true
    },
    items : { type: Object, required:true },
    phone: { type: Number, required: true },
    address: {type: String, required: true },
    paymentType: {type: String, default: 'COD' },
    status: {type: String, default: 'order_placed' },
    iscancelled:{type: Boolean,default:false},
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);