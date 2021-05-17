import mongoose,{Schema} from 'mongoose';
/** @type {categorieSchema} */
const categorieSchema = new Schema({
    name:{type:String, maxlength:50,unique:true,required:true},
    description: {type:String,maxlength:255},
    status: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const Categorie = mongoose.model('categorie',categorieSchema);

export default Categorie;