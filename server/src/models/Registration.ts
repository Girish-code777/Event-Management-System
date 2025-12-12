import mongoose, { Schema, Document, Types } from 'mongoose';

export type RegistrationStatus = 'registered' | 'waitlisted' | 'cancelled' | 'checked_in';

export interface IRegistration extends Document {
  eventId: Types.ObjectId;
  studentId: Types.ObjectId;
  status: RegistrationStatus;
  registrationCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['registered','waitlisted','cancelled','checked_in'], default: 'registered' },
  registrationCode: { type: String, required: true, index: true }
}, { timestamps: true });

RegistrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<IRegistration>('Registration', RegistrationSchema);
