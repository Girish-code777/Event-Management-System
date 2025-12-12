import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  category?: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  venue?: string;
  capacity?: number;
  coverImageUrl?: string;
  createdBy: Types.ObjectId;
  coordinators: Types.ObjectId[];
  isPublished: boolean;
  tags: string[];
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  category: String,
  description: String,
  date: { type: String, required: true },
  startTime: String,
  endTime: String,
  venue: String,
  capacity: Number,
  coverImageUrl: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coordinators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPublished: { type: Boolean, default: false },
  tags: [{ type: String }],
}, { timestamps: { createdAt: true, updatedAt: true } });

export default mongoose.model<IEvent>('Event', EventSchema);
