import mongoose,{Schema} from 'mongoose';
/** @type {orderSchema} */
const orderSchema = new Schema({
    user:{type: Schema.ObjectId, ref:'user',required:true},
    person:{type: Schema.ObjectId, ref:'person',required:true},
    type_proof:{type:String,maxlength:20,required:true},
    serial_proof: {type:String,maxlength:7},
    number_proof: {type:String,maxlength:10,required:true},
    tax:{type:Number, required:true},
    total:{type:Number, required:true},
    details: [{
        _id:{
            type:String,
            required:true
        },
        article:{
            type:String,
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }
    }],
    status: {type:Number, default:1},
    createdAt: {type: Date, default: Date.now }
});
const Order = mongoose.model('order',orderSchema);
export default Order;