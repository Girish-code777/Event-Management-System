import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'admin' | 'student' | 'coordinator';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department?: string;
  year?: string;
  phone?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student', 'coordinator'], required: true, default: 'student' },
  department: String,
  year: String,
  phone: String,
}, { timestamps: { createdAt: true, updatedAt: true } });

export default mongoose.model<IUser>('User', UserSchema);
