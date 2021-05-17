import mongoose,{Schema} from 'mongoose';
/** @type {articleSchema} */
const articleSchema = new Schema({
    categorie: {type: Schema.ObjectId, ref:'categorie'},
    code: {type: String,maxlength:64},
    name:{type:String,maxlength:50,unique:true,required:true},
    description: {type:String,maxlength:255},
    pvp:{type:Number,required:true},
    stock:{type:Number,required:true},
    status:{type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});
const Article = mongoose.model('article',articleSchema);
export default Article;