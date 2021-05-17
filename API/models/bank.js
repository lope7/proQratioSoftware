import mongoose,{Schema} from 'mongoose';
/** @type {bankSchema} */
const bankSchema = new Schema({
    name:{type:String, maxlength:50,unique:true,required:true},
    address: {type:String,maxlength:255},
    phone: {type:String,maxlength:255},
    email: {type:String,maxlength:255},
    link: {type:String,maxlength:255},
    status: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const Bank = mongoose.model('bank',bankSchema);

export default Bank;