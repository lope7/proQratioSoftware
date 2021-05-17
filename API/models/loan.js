import mongoose,{Schema} from 'mongoose';
/** @type {loanSchema} */
const loanSchema = new Schema({
    bank: {type: Schema.ObjectId, ref:'bank'},
    startDate: {type: String,maxlength:64},
    endDate:{type:String,maxlength:64},
    account: {type:String,maxlength:255,required:true},
    amount: {type:Number,maxlength:255,required:true},
    status:{type:Number,default:1},
});
const Loan = mongoose.model('loan',loanSchema);
export default Loan;