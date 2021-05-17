import mongoose, {Schema} from 'mongoose';
/** @type {userSchema} */
const userSchema = new Schema({
    role: { type:String,maxlength:30, required:true},
    name: { type:String,maxlength:50, unique:true, required:true},
    document_type: { type:String,maxlength:20},
    document_num: { type:String,maxlength:20},
    address: { type:String, maxlength:70},
    phone: { type:String, maxlength:20},
    email: { type:String, maxlength:50, unique:true, required:true},
    password: { type:String, maxlength:64, required:true},
    status: { type:Number, default:1},
	createdAt: { type: Date, default: Date.now }
    //admin@proqratio.com contraseña:admin
});

const User = mongoose.model('user',userSchema);
export default User;