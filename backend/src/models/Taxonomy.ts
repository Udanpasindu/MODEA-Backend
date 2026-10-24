import mongoose,{Schema} from 'mongoose';
const base={name:{type:String,required:true},slug:{type:String,required:true,unique:true},description:String,image:String,published:{type:Boolean,default:true},order:{type:Number,default:0},featured:{type:Boolean,default:false}};
export const Category=mongoose.model('Category',new Schema(base,{timestamps:true}));
export const Collection=mongoose.model('Collection',new Schema(base,{timestamps:true}));
