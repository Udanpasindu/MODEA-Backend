import mongoose, { Schema } from 'mongoose';
const schema = new Schema({ name: { type: String, required: true }, username: { type: String, required: true, unique: true, lowercase: true, trim: true }, email: { type: String, lowercase: true, trim: true }, passwordHash: { type: String, required: true }, role: { type: String, enum: ['owner', 'staff'], default: 'owner' }, active: { type: Boolean, default: true }, lastLoginAt: Date }, { timestamps: true });
export const Admin = mongoose.model('Admin', schema);
