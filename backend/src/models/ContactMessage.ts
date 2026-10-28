import mongoose,{Schema} from 'mongoose';
const schema=new Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,trim:true,lowercase:true},phone:{type:String,required:true,trim:true},message:{type:String,required:true},read:{type:Boolean,default:false,index:true}},{timestamps:true});
export const ContactMessage=mongoose.model('ContactMessage',schema);
