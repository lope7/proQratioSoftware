import mongoose, {Schema} from 'mongoose';
/** @type {meetingSchema} */
const meetingSchema = new Schema({
    organiser: { type:String,maxlength:50,required:true},
    date: { type:String,maxlength:20},
    hour: { type:String, maxlength:70},
    duration: { type:String,maxlength:20},
    link: { type:String, maxlength:70},
    issue: { type:String, maxlength:70},
    status: { type:Number, default:1},
	createdAt: { type: Date, default: Date.now }
});

const Meeting = mongoose.model('meet',meetingSchema);
export default Meeting;